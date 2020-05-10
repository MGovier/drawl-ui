import React, { useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'

interface DrawScreenProps {
  word: string
}

function DrawScreen({ word }: DrawScreenProps) {
  const drawing = useRef<CanvasDraw>(null)
  const [colour, setColour] = useState('#444')
  const [disabled, setDisabled] = useState(false)
  const [buttonText, setButtonText] = useState(`I'm Done`)

  function saveDrawing() {
    setDisabled(true)
    setButtonText('Sending...')
    const drawingData = drawing.current?.getSaveData()
    console.log(JSON.stringify(drawingData))
  }

  return (
    <div id="content-window">
      <p style={{ textAlign: 'center' }}>It's your turn to draw a:</p>
      <p style={{ textAlign: 'center' }}>{word}</p>
      <div className="button-flex">
        <span className="colour-row">
          <button
            className={colour === '#444' ? 'selected' : ''}
            style={{
              backgroundColor: '#444',
            }}
            onClick={() => {
              setColour('#444')
            }}
          ></button>
          <button
            className={colour === '#D91216' ? 'selected' : ''}
            style={{
              backgroundColor: '#D91216',
            }}
            onClick={() => {
              setColour('#D91216')
            }}
          ></button>
          <button
            className={colour === '#FFB71C' ? 'selected' : ''}
            style={{
              backgroundColor: '#FFB71C',
            }}
            onClick={() => {
              setColour('#FFB71C')
            }}
          ></button>
          <button
            className={colour === '#609130' ? 'selected' : ''}
            style={{
              backgroundColor: '#609130',
            }}
            onClick={() => {
              setColour('#609130')
            }}
          ></button>
        </span>
        <div style={{ flexGrow: 1 }} />
        <button
          className="nes-btn"
          onClick={() => {
            drawing.current?.undo()
          }}
        >
          Undo
        </button>
      </div>
      <CanvasDraw
        ref={drawing}
        lazyRadius={1}
        hideGrid={true}
        brushRadius={4}
        canvasWidth={320}
        canvasHeight={400}
        className="drawing-panel"
        brushColor={colour}
        disabled={disabled}
      />
      <button
        type="button"
        className="nes-btn is-primary"
        disabled={disabled}
        onClick={() => {
          saveDrawing()
        }}
        style={{ margin: '0 auto', display: 'block' }}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default DrawScreen
