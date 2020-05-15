import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { sendStreamMessage } from '../api/gameStateReducer'

function LobbyScreen() {
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const { players, joinCode, leader, streamConnected } = useSelector((state: RootState) => state.gameState)

  useEffect(() => {
    const localName = localStorage.getItem('playerName')
    if (localName !== null && localName !== '') {
      setName(localName)
      if (streamConnected) {
        dispatch(sendStreamMessage({
          type: 'name',
          data: localName
        }))
      }
    }
  }, [dispatch, streamConnected])

  function sendName() {
    localStorage.setItem('playerName', name)
    if (name.length > 1 && name.length < 15) {
      dispatch(sendStreamMessage({
        type: 'name',
        data: name
      }))
    }
  }

  function startGame() {
    dispatch(sendStreamMessage({
      type: 'start'
    }))
  }

  if (!streamConnected) {
    return (
      <p>Waiting for WebSocket connection...</p>
    )
  }

  return (
    <div id="content-window">
      <p style={{ textAlign: 'center' }}>Room Code: {joinCode}</p>
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
            let newName = evt.target.value
            if (newName.length > 15) {
              newName = newName.substring(0,15)
            }
            setName(newName)
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
      { leader && 
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
