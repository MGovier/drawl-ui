import React, {useState, useEffect} from 'react'
import StartScreen from './components/StartScreen'
import DrawScreen from './components/DrawScreen'
import GuessScreen from './components/GuessScreen'
import LobbyScreen from './components/LobbyScreen'

function App() {
  const [gameStage, setGameState] = useState({stage: 0, leader: false, joinCode: '', gameID: ''})
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (gameStage.gameID !== '') {
      console.log('i wanna websocket')
      const ws = new WebSocket('ws://localhost:8080/ws/' + gameStage.gameID)
      ws.onmessage = msg => { 
        let data = JSON.parse(msg.data)
        console.log(data)
        setPlayers(data)
      }
    }
  }, [gameStage.gameID])

  if (gameStage.stage === 0) {
    return <StartScreen updateGameStage={setGameState}/>
  }
  if (gameStage.stage === 1) {
    return <LobbyScreen isPartyLeader={gameStage.leader} players={players} joinCode={gameStage.joinCode}/>
  }
  return null
}

export default App
