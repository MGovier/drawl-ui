import axios from 'axios'
import { Player } from './gameStateReducer'

export interface GameResp {
  joinCode: string
  gameID: string
  player: Player
}

export interface GameReview {
  gameID: string
  gameStage: string
  joinCode: string
  limit: number
  round: number
  players: Player[]
  wordJourneys: Journey[]
}

export interface Journey {
  gamePlays: GamePlay[]
  playOrder: Player[]
}

export interface GamePlay {
  player: Player | null
  word? : string
  drawing? : string
}

export async function joinGame(joinCode: string): Promise<GameResp> {
  try {
    const resp = await axios.post<GameResp>('http://localhost:8080/join', {
      joinCode: joinCode,
    })
    return {
      joinCode: resp.data.joinCode,
      gameID: resp.data.gameID,
      player: resp.data.player,
    }
  } catch (err) {
    throw err
  }
}

export async function startGame(): Promise<GameResp> {
  try {
    const resp = await axios.get<GameResp>('http://localhost:8080/game')
    return {
      joinCode: resp.data.joinCode,
      gameID: resp.data.gameID,
      player: resp.data.player,
    }
  } catch (err) {
    throw err
  }
}

export async function getGameReview(gameID : string): Promise<GameReview> {
  try {
    const resp = await axios.get<GameReview>('http://localhost:8080/review?game_id=' + gameID)
    return resp.data
  } catch (err) {
    throw err
  }
}
