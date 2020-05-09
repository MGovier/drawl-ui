import React from 'react'
import StartScreen from './components/StartScreen'
import DrawScreen from './components/DrawScreen'
import GuessScreen from './components/GuessScreen'
import LobbyScreen from './components/LobbyScreen'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Drawl!</h1>
        <div id="content-window">
          <LobbyScreen isPartyLeader={true}/>
        </div>
      </header>
    </div>
  )
}

export default App
