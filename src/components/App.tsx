import React, { useEffect } from 'react'
import StartScreen from './StartScreen'
import DrawScreen from './DrawScreen'
import GuessScreen from './GuessScreen'
import LobbyScreen from './LobbyScreen'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { subscribeToGameStream, unsubscribeFromGameStream } from '../api/gameStateReducer'
import ReviewScreen from './ReviewScreen'
import ResultsScreen from './ResultsScreen'

function App() {
  const dispatch = useDispatch()
  const { stage, gameID, player } = useSelector((state: RootState) => state.gameState)


  useEffect(() => {
    if (gameID !== '' && player.playerID !== '') {
      dispatch(subscribeToGameStream(gameID, player.playerID))
      return () => {
        dispatch(unsubscribeFromGameStream())
      }
    }
  }, [dispatch, gameID, player])

  switch (stage) {
    case 'start':
      return <StartScreen />
    case 'lobby':
      return <LobbyScreen />
    case 'draw':
      return <DrawScreen />
    case 'guess':
      return <GuessScreen />
    case 'review':
      return <ReviewScreen />
    case 'results':
      return <ResultsScreen />
    default:
      return <p>Ah... this isn't supposed to happen</p>
  }
}

export default App
