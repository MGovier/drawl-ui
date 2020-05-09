import React, { useState } from 'react'
import axios, {AxiosResponse} from 'axios'

interface StartScreenProps {
  updateGameStage: Function
}

interface GameResp {
  joinCode: string
  gameID: string
}

function StartScreen({ updateGameStage }: StartScreenProps) {
  const [joinCode, setJoinCode] = useState('')

  async function joinGame() {
    try {
      const resp = await axios.post('http://localhost:8080/join', {
        joinCode: joinCode,
      })
      updateGameStage({stage: 1, joinCode: resp.data.joinCode, gameID: resp.data.gameID, leader: false})
    } catch (err) {
      console.error(err)
    }
  }
  async function startGame() {
    try {
      const resp : AxiosResponse<GameResp> = await axios.get('http://localhost:8080/game')
      updateGameStage({stage: 1, joinCode: resp.data.joinCode, gameID: resp.data.gameID, leader: true})
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      <p>
        Drawl is a multiplayer party game where you take turns drawing a phrase and guessing other people's masterpieces!
      </p>
      <p>
        Everyone needs their own device to draw on. One player starts the game, and then everyone else can use the code
        to join.
      </p>
      <form>
        <div style={{ display: 'flex' }}>
          <div className="nes-field" style={{ maxWidth: '70%', margin: 'auto', minWidth: '12rem' }}>
            <label htmlFor="game_id">Game ID</label>
            <input
              type="text"
              id="game_id"
              className="nes-input"
              value={joinCode}
              onChange={(evt) => {
                setJoinCode(evt.target.value)
              }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '6rem', margin: 'auto', marginTop: '32px', height: '48px' }}
            className="nes-btn is-primary"
            onClick={(evt) => {
              evt.preventDefault()
              joinGame()
            }}
          >
            Join
          </button>
        </div>
      </form>
      <p style={{ padding: '2rem', textAlign: 'center', margin: 'auto' }}>Or...</p>
      <button
        type="button"
        className="nes-btn is-primary"
        style={{ margin: '0 auto', display: 'block' }}
        onClick={() => {
          startGame()
        }}
      >
        Start a New Game
      </button>
    </>
  )
}

export default StartScreen
