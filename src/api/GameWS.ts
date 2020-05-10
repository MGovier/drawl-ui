import { GameUpdate, GameState } from "./gameStateReducer"

export default class WebSocketManager {
  socketUrl: string
  gameID: string
  playerID: string
  ws: WebSocket | null
  stateUpdater: Function
  gameState: GameState

  constructor(socketUrl: string, gameState : GameState, stateUpdater : Function ) {
    this.socketUrl = socketUrl
    this.gameID = ''
    this.playerID = ''
    this.ws = null
    this.gameState = gameState
    this.stateUpdater = stateUpdater
  }

  connect(gameID : string, playerID: string) : void {
    console.log(gameID, playerID)
    if (gameID === this.gameID && playerID === this.playerID) {
      // Don't need to do anything, nothing has changed (unless we DC'd?)
      return
    }
    this.playerID = playerID
    this.gameID = gameID
    this.ws = new WebSocket(`ws://localhost:8080/ws/${this.gameID}/${this.playerID}`)
    this.ws.onmessage = (msg) => {
      this.handleMessage(msg)
    }
    this.ws.onerror = (err) => {
      this.handleError(err)
    }
  }

  disconnect() {
    this.ws?.close()
  }

  handleError(err : Event) {
    console.error(err)
  }

  handleMessage(msg: MessageEvent) {
    try {
      const gameUpdate = JSON.parse(msg.data)
      // Message data will be base64 for... efficiency...
      const payload = atob(gameUpdate.data)
      switch (gameUpdate.type) {
        case "players":
          this.stateUpdater({...this.gameState, players: JSON.parse(payload)})
      }

    } catch (err) {
      console.error('WebSocket error:', err)
    }
  }

  sendUpdate(msg: GameUpdate) {
    this.ws?.send(JSON.stringify(msg))
  }
}
