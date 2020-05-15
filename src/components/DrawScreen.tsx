import React, { useRef, useState, useEffect } from 'react'
import CanvasDraw from 'react-canvas-draw'
import { useDispatch, useSelector } from 'react-redux'
import { sendStreamMessage } from '../api/gameStateReducer'
import { RootState } from '../rootReducer'


function DrawScreen() {
  const drawing = useRef<CanvasDraw>(null)
  const dispatch = useDispatch()
  const [colour, setColour] = useState('#444')
  const [disabled, setDisabled] = useState(false)
  const [buttonText, setButtonText] = useState(`I'm Done`)
  const { word, streamConnected } = useSelector((state: RootState) => state.gameState)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!streamConnected) {
      setButtonText("Reconnecting...")
    }
  }, [streamConnected])

  function sendDrawing() {
    const drawingData = drawing.current?.getSaveData()
    if (drawingData !== null) {
      setDisabled(true)
      setButtonText('Sending...')
      dispatch(sendStreamMessage({
        type: 'drawing',
        data: drawingData
      }))
      setButtonText('Waiting...')
    } 
  }

  return (
    <div id="content-window">
      <p style={{ textAlign: 'center' }}>It's your turn to draw:</p>
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
        lazyRadius={0}
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
          sendDrawing()
        }}
        style={{ margin: '0 auto', display: 'block' }}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default DrawScreen
