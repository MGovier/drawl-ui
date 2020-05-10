import axios from 'axios'
import { Player } from './gameStateReducer'

export interface GameResp {
  joinCode: string
  gameID: string
  player: Player
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
