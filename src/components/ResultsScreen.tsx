import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { sendStreamMessage, unsubscribeFromGameStream } from '../api/gameStateReducer'
import { Player } from '../api/gameStateReducer'

function ResultsScreen() {
  const dispatch = useDispatch()
  const { players, leader } = useSelector((state: RootState) => state.gameState)

  function startGame() {
    dispatch(
      sendStreamMessage({
        type: 'start',
      })
    )
  }

  function endGame() {
    dispatch(unsubscribeFromGameStream())
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  let playerClone: Player[] = []
  players.forEach((playa) => playerClone.push(Object.assign({}, playa)))
  const playersByPoints = playerClone.sort((a: Player, b: Player) => b.points - a.points)

  let actions = null
  if (leader) {
    actions = (
      <>
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => {
            startGame()
          }}
          style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }}
        >
          Another Round
        </button>
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => {
            endGame()
          }}
          style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }}
        >
          End Game
        </button>
      </>
    )
  } else {
    actions = (
      <>
        <p>Waiting to see if your leader fancies another game...</p>
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => {
            endGame()
          }}
          style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }}
        >
          Quit Session
        </button>
      </>
    )
  }

  return (
    <div id="content-window">
      <div className="nes-table-responsive">
        <table className="nes-table is-bordered is-centered" style={{ margin: '1rem auto' }}>
          <thead>
            <tr>
              <th>Player</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {playersByPoints.map((player: Player) => (
              <tr key={player.playerID}>
                <td>{player.playerName}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {actions}
    </div>
  )
}

export default ResultsScreen
