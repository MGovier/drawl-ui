import React, { useState, useEffect } from 'react'
import CanvasDraw from 'react-canvas-draw'

interface GuessScreenProps {
  drawData: string
}

function GuessScreen({ drawData }: GuessScreenProps) {
  const [disabled, setDisabled] = useState(false)
  const [buttonText, setButtonText] = useState(`Send Guess`)
  const [guess, setGuess] = useState('')
  const [drawing, setDrawing] = useState('')

  useEffect(() => {
    setDrawing(drawing)
  }, [drawing])

  function sendGuess() {
    setDisabled(true)
    setButtonText('Sending...')
    console.log('sending guess:' + guess)
  }

  return (
    <div id="content-window">
      <p style={{ textAlign: 'center' }}>What do you think this is?</p>
      {drawing !== '' && (
        <CanvasDraw
          lazyRadius={1}
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
          onChange={(evt) => {
            setGuess(evt.target.value)
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
