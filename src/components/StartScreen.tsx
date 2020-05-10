import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { joinAGame, startNewGame } from '../api/gameStateReducer'

function StartScreen() {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state: RootState) => state.gameState)

  const [joinCode, setJoinCode] = useState('')

  return (
    <>
      <p>
        Drawl is a multiplayer party game where you take turns drawing a phrase and guessing other people's
        masterpieces!
      </p>
      <p>
        Everyone needs their own device to draw on. One player starts the game, and then everyone else can use the code
        to join.
      </p>
      {error !== null && (
        <div className="nes-balloon from-left">
          <p>Whoops, there was a problem! {error}</p>
        </div>
      )}
      <form>
        <div style={{ display: 'flex' }}>
          <div className="nes-field" style={{ maxWidth: '70%', margin: 'auto', minWidth: '12rem' }}>
            <label htmlFor="game_id">Game ID</label>
            <input
              type="text"
              id="game_id"
              className="nes-input"
              value={joinCode}
              disabled={isLoading}
              onChange={(evt) => {
                setJoinCode(evt.target.value)
              }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '6rem', margin: 'auto', marginTop: '32px', height: '48px' }}
            className="nes-btn is-primary"
            disabled={isLoading}
            onClick={(evt) => {
              evt.preventDefault()
              dispatch(joinAGame(joinCode))
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
        disabled={isLoading}
        onClick={() => {
          dispatch(startNewGame())
        }}
      >
        Start a New Game
      </button>
    </>
  )
}

export default StartScreen
