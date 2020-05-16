import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameResp, startGame, joinGame, getGameReview, GameReview } from './GameAPI'
import { connect, send } from '@giantmachines/redux-websocket'

import { AppThunk } from '../store'

export interface GameState {
  round?: number
  stage: 'start' | 'draw' | 'guess' | 'lobby' | 'review' | 'results'
  gameID: string
  joinCode: string
  player: Player
  players: Player[]
  retryCount: number
  leader: boolean
  word: string
  drawing: string
  isLoading: boolean
  error: string | null
  streamConnected: boolean
  reviewData: GameReview | null
  session: number
}

export interface StreamMessage {
  type: 'name' | 'start' | 'drawing' | 'guess' | 'award' | 'done' | 'quit'
  data?: string
}

export const defaultGameState: GameState = {
  round: 0,
  stage: 'start',
  gameID: '',
  joinCode: '',
  player: {
    playerName: '',
    playerID: '',
    points: 0
  },
  retryCount: 0,
  players: [],
  leader: false,
  drawing: '',
  word: '',
  isLoading: false,
  error: null,
  streamConnected: false,
  reviewData: null,
  session: 0
}

export interface Player {
  playerID: string
  playerName: string
  points: number
}

function setLocalStorage(gameID: string, playerID: string) {
  localStorage.setItem('playerID', playerID)
  localStorage.setItem('gameID', gameID)
}

function clearLocalStorage() {
  // Don't use clear as we still want to store player name!
  localStorage.removeItem('playerID')
  localStorage.removeItem('gameID')
}

const gameState = createSlice({
  name: 'gameState',
  initialState: defaultGameState,
  reducers: {
    startLoading(state: GameState) {
      state.isLoading = true
    },
    loadingFailed(state: GameState, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    joinGameSuccess(state, { payload }: PayloadAction<GameResp>) {
      const { gameID, player, joinCode } = payload
      state.gameID = gameID
      state.joinCode = joinCode
      state.player = player
      state.stage = 'lobby'
      state.leader = false
      state.isLoading = false
      state.error = null
    },
    newGameSuccess(state, { payload }: PayloadAction<GameResp>) {
      const { gameID, player, joinCode } = payload
      state.gameID = gameID
      state.player = player
      state.joinCode = joinCode
      state.stage = 'lobby'
      state.leader = true
      state.isLoading = false
      state.error = null
    },
    connectStreamSuccess(state) {
      state.error = null
    },
    loadReviewDataSuccess(state, { payload }: PayloadAction<GameReview>) {
      state.reviewData = payload
      state.isLoading = false
      state.error = null
    },
    reset() {
      clearLocalStorage()
      return defaultGameState
    }
  },
  extraReducers: {
    'GAME_STREAM::MESSAGE': (state, action) => {
      state.streamConnected = true
      try {
        const msg = JSON.parse(action.payload.message)
        switch (msg.type) {
          case 'players':
            state.stage = 'lobby'
            state.reviewData = null
            state.players = JSON.parse(atob(msg.data))
            break
          case 'word':
            state.stage = 'draw'
            state.word = atob(msg.data)
            break
          case 'drawing':
            state.stage = 'guess'
            state.drawing = atob(msg.data)
            break
          case 'review':
            state.stage = 'review'
            break
          case 'results':
            state.stage = 'results'
            state.players = JSON.parse(atob(msg.data))
            state.session = state.session + 1
            break
          default:
            return state
        }
      } catch (err) {
        state.error = 'Could not parse WebSocket message as JSON'
      }
    },
    'GAME_STREAM::ERROR': (state, action) => {
      state.retryCount = state.retryCount + 1
      state.streamConnected = false
      state.error = `Problem with the WebSocket, hold on, I'm working on it...`
      if (state.retryCount > 10) {
        state.error = `This isn't going well...`
      } else if (state.retryCount > 100) {
        return defaultGameState
      }
    },
    'GAME_STREAM::RECONNECTED': (state) => {
      state.streamConnected = true
      state.error = null
    }
  },
})

export const {
  startLoading,
  loadingFailed,
  joinGameSuccess,
  newGameSuccess,
  connectStreamSuccess,
  loadReviewDataSuccess,
  reset
} = gameState.actions

export default gameState.reducer

export const startNewGame = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const issues = await startGame()
    dispatch(newGameSuccess(issues))
  } catch (err) {
    dispatch(loadingFailed(err.toString()))
  }
}

export const joinAGame = (joinCode: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const issue = await joinGame(joinCode)
    dispatch(joinGameSuccess(issue))
  } catch (err) {
    dispatch(loadingFailed(err.toString()))
  }
}

export const subscribeToGameStream = (gameID: string, playerID: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    dispatch(connect(`${process.env.REACT_APP_WEBSOCKET_URL}?game_id=${gameID}&player_id=${playerID}`, 'GAME_STREAM'))
    dispatch(connectStreamSuccess())
  } catch (err) {
    dispatch(loadingFailed(err.toString()))
  }
}

export const unsubscribeFromGameStream = (): AppThunk => async (dispatch) => {
  try {
    dispatch(reset())
  } catch (err) {
    dispatch(loadingFailed(err.toString()))
  }
}

export const sendStreamMessage = (message: StreamMessage): AppThunk => async (dispatch) => {
  try {
    dispatch(send(message, 'GAME_STREAM'))
  } catch (err) {
    console.error(err)
  }
}

export const getGameReviewData = (gameID: string, session: number): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const data = await getGameReview(gameID, session)
    dispatch(loadReviewDataSuccess(data))
  } catch (err) {
    dispatch(loadingFailed(err.toString()))
    console.error(err)
  }
}
