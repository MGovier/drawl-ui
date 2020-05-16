import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { getGameReviewData, sendStreamMessage } from '../api/gameStateReducer'
import CanvasDraw from 'react-canvas-draw'

export default function ReviewScreen() {
  const dispatch = useDispatch()
  const [journey, setJourney] = useState(0)
  const [waiting, setWaiting] = useState(false)
  const { gameID, reviewData, player, isLoading, session } = useSelector((state: RootState) => state.gameState)

  useEffect(() => {
    dispatch(getGameReviewData(gameID, session))
  }, [dispatch, gameID, session])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function nextPlayer() {
    if (reviewData == null) {
      return
    }
    window.scrollTo(0, 0)
    if (journey + 1 >= reviewData.players.length) {
      // Tell the server we're done, it will update us when we can move on to the results (when everyone has finished reviewing!)
      dispatch(
        sendStreamMessage({
          type: 'done',
        })
      )
      setWaiting(true)
    } else {
      setJourney(journey + 1)
    }
  }

  function givePoint() {
    dispatch(
      sendStreamMessage({
        type: 'award',
        data: reviewData?.wordJourneys[journey].playOrder[0].playerID,
      })
    )
    nextPlayer()
  }

  if (reviewData == null || isLoading) {
    return <p>Loading...</p>
  }

  if (waiting) {
    return <p>Waiting for all players to finish voting...</p>
  }

  const journeyData = reviewData.wordJourneys[journey]

  const journeyRender = journeyData.gamePlays.map((play, index) => {
    let playType = null
    play.hasOwnProperty('word') ? (playType = 'word') : (playType = 'guess')
    if (playType === 'word') {
      if (play.player == null) {
        return (
          <div className="guess" key={journey.toString() + index.toString()}>
            <p> {journeyData.playOrder[0].playerName}'s phrase was... </p>
            <p style={{ color: 'red' }}>{play.word}</p>
          </div>
        )
      }
      return (
        <div className="guess" key={journey.toString() + index.toString()}>
          <p>{play.player.playerName} thought this was... </p>
          <p style={{ color: 'red' }}>{play.word}</p>
        </div>
      )
    }
    if (playType === 'guess') {
      return (
        <div className="review-drawing" key={journey.toString() + index.toString()}>
          <p>{play.player?.playerName} drew this as... </p>
          <CanvasDraw
            lazyRadius={0}
            hideGrid={true}
            brushRadius={4}
            canvasWidth={320}
            canvasHeight={400}
            className="drawing-panel"
            disabled={true}
            hideInterface={true}
            saveData={play.drawing}
          />
        </div>
      )
    }
    return null
  })
  let actions = null
  if (journeyData.playOrder[0].playerID === player.playerID) {
    actions = (
      <>
        <button
          type="button"
          style={{ width: '70%', margin: '1rem auto', display: 'block' }}
          className="nes-btn is-primary"
          onClick={() => {
            nextPlayer()
          }}
        >
          Next Player
        </button>
      </>
    )
  } else {
    actions = (
      <>
        <p>Reckon this deserves a point?</p>
        <button
          type="button"
          style={{ width: '70%', margin: '1rem auto', display: 'block' }}
          className="nes-btn is-primary"
          onClick={() => {
            givePoint()
          }}
        >
          Give Point
        </button>
        <button
          type="button"
          style={{ width: '70%', margin: '1rem auto', display: 'block' }}
          className="nes-btn is-primary"
          onClick={() => {
            nextPlayer()
          }}
        >
          Maybe Next Time...
        </button>
      </>
    )
  }
  return (
    <>
      {journeyRender}
      {actions}
    </>
  )
}
