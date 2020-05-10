import { useState, useEffect } from 'react'

export interface GameState {
  stage: number
  leader: boolean
  joinCode: string
  gameID: string
  player: Player
}

export interface Player {
  playerID: string
  playerName: string
}

function useGameState() {
  const [gameState, updateGameState] = useState()
}
