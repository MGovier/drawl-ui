import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameResp, startGame, joinGame } from './GameAPI'
import { connect, disconnect, send } from '@giantmachines/redux-websocket'

import { AppThunk } from '../store'

export interface GameState {
  round?: number
  stage: 'start' | 'draw' | 'guess' | 'lobby' | 'review' | 'results'
  gameID: string
  joinCode: string
  player: Player
  players: Player[]
  leader: boolean
  word: string
  drawing: string
  isLoading: boolean
  error: string | null
  streamConnected: boolean
}

export interface GameUpdate {
  type: 'drawing' | 'guess' | 'award' | 'name'
  data: string
}

export interface StreamMessage {
  type: 'name' | 'start' | 'drawing' | 'guess'
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
  },
  players: [],
  leader: false,
  drawing: '',
  word: '',
  isLoading: false,
  error: null,
  streamConnected: false
}

export interface Player {
  playerID: string
  playerName: string
}

function startLoading(state: GameState) {
  state.isLoading = true
}

function loadingFailed(state: GameState, action: PayloadAction<string>) {
  state.isLoading = false
  state.error = action.payload
}

const gameState = createSlice({
  name: 'gameState',
  initialState: defaultGameState,
  reducers: {
    joinGameStart: startLoading,
    newGameStart: startLoading,
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
    newGameFailure: loadingFailed,
    joinGameFailure: loadingFailed
  },
  extraReducers: {
    'GAME_STREAM::MESSAGE': (state, action) => {
      state.streamConnected = true
      try {
        const msg = JSON.parse(action.payload.message)
        const payload = atob(msg.data)
        console.log(msg, payload)
        switch (msg.type) {
          case 'players':
            state.players = JSON.parse(payload)
            break
          case 'word':
            state.stage = 'draw'
            state.word = payload
            break
          case 'drawing':
            state.stage = 'guess'
            state.drawing = payload
            break
          default:
            return state
        }
      } catch (err) {
        state.error = 'Could not parse WebSocket message as JSON'
      }
    },
    'GAME_STREAM::ERROR': (state, action) => {
      console.error(action)
      state.streamConnected = false
      state.error = `Could not establish WebSocket connection - we'll keep trying!`
    },
  },
})

export const {
  joinGameStart,
  joinGameSuccess,
  joinGameFailure,
  newGameStart,
  newGameSuccess,
  newGameFailure,
  connectStreamSuccess
} = gameState.actions


export default gameState.reducer

export const startNewGame = (): AppThunk => async dispatch => {
  try {
    dispatch(newGameStart())
    const issues = await startGame()
    dispatch(newGameSuccess(issues))
  } catch (err) {
    dispatch(newGameFailure(err.toString()))
  }
}

export const joinAGame = (
  joinCode: string
): AppThunk => async dispatch => {
  try {
    dispatch(joinGameStart())
    const issue = await joinGame(joinCode)
    dispatch(joinGameSuccess(issue))
  } catch (err) {
    dispatch(joinGameFailure(err.toString()))
  }
}

export const subscribeToGameStream = (gameID : string, playerID: string) : AppThunk => async (dispatch) => {
  try {
    dispatch(joinGameStart())
    dispatch(connect(`ws://localhost:8080/${gameID}/${playerID}/`, 'GAME_STREAM'))
    dispatch(connectStreamSuccess())
  } catch (err) {
    dispatch(joinGameFailure(err.toString()))
  }
}

export const unsubscribeFromGameStream = () : AppThunk => async (dispatch) => {
  try {
    dispatch(disconnect('GAME_STREAM'))
  } catch (err) {
    dispatch(joinGameFailure(err.toString()))
  }
}

export const sendStreamMessage = (message : StreamMessage) : AppThunk => async (dispatch) => {
  try {
    dispatch(send(message, "GAME_STREAM"))
  } catch (err) {
    console.error(err)
  }
}