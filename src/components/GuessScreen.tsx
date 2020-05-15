import React, { useState, useEffect } from 'react'
import CanvasDraw from 'react-canvas-draw'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../rootReducer'

import { sendStreamMessage } from '../api/gameStateReducer'

function GuessScreen() {
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)
  const [buttonText, setButtonText] = useState(`Send Guess`)
  const [guess, setGuess] = useState('')
  const { drawing, streamConnected } = useSelector((state: RootState) => state.gameState)

  useEffect(() => {
    if (!streamConnected) {
      setButtonText("Reconnecting...")
    }
  }, [streamConnected])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function sendGuess() {
    setDisabled(true)
    if (guess !== '') {
      setButtonText('Sending...')
      dispatch(sendStreamMessage({
        type: 'guess',
        data: guess
      }))
      setButtonText('Waiting...')
    } else {
      setDisabled(false)
    }
  }

  return (
    <div id="content-window">
      <p style={{ textAlign: 'center' }}>What do you think this is?</p>
      {drawing !== '' && (
        <CanvasDraw
          lazyRadius={0}
          hideGrid={true}
          brushRadius={6}
          canvasWidth={320}
          canvasHeight={400}
          className="drawing-panel"
          disabled={true}
          saveData={drawing}
        />
      )}
      <div className="nes-field" style={{ maxWidth: '320px', margin: '0 auto' }}>
        <label htmlFor="guess">Your Guess</label>
        <input
          type="text"
          id="guess"
          className="nes-input"
          value={guess}
          disabled={disabled}
          onChange={(evt) => {
            if (evt.target.value.length < 30) {
              setGuess(evt.target.value)
            }
          }}
        />
      </div>
      <button
        type="button"
        className="nes-btn is-primary"
        disabled={disabled}
        onClick={() => {
          sendGuess()
        }}
        style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default GuessScreen
