import React, { useState, useEffect } from 'react'

interface LobbyProps {
  isPartyLeader: boolean
  joinCode: string
  players: Player[]
}

interface Player {
  playerID: string
  playerName: string
}

function LobbyScreen({ isPartyLeader, joinCode, players }: LobbyProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    const localName = localStorage.getItem('playerName')
    if (localName !== null && localName !== '') {
      setName(localName)
    }
  }, [])

  function sendName() {
    localStorage.setItem('playerName', name)
    console.log('sending name:' + name)
  }

  function startGame() {
    console.log('lets go')
  }

  return (
    <div id="content-window">
      <p style={{ textAlign: 'center' }}>Room code: {joinCode}</p>
      <p style={{ textAlign: 'center' }}>Players:</p>
      <div className="lists">
        <ul className="nes-list is-disc">
          {players.map(player => (<li key={player.playerID}>{player.playerName}</li>))}
        </ul>
      </div>
      <div className="nes-field" style={{ maxWidth: '320px', margin: '0 auto' }}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          className="nes-input"
          value={name}
          onChange={(evt) => {
            setName(evt.target.value)
          }}
        />
      </div>
      <button
        type="button"
        className="nes-btn is-primary"
        onClick={() => {
          sendName()
        }}
        style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }}
      >
        Set Name
      </button>
      { isPartyLeader && 
            <button
            type="button"
            className="nes-btn is-primary"
            onClick={() => {
              startGame()
            }}
            style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }}
          >
            Start Game
          </button>}
    </div>
  )
}

export default LobbyScreen
