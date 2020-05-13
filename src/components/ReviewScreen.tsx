import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../rootReducer'
import { getGameReviewData } from '../api/gameStateReducer'

export default function ReviewScreen() {
    const dispatch = useDispatch()
    const [ player, setPlayer ] = useState(0)
    const { gameID, reviewData } = useSelector((state: RootState) => state.gameState)

    useEffect(() => {
        dispatch(getGameReviewData(gameID))
    }, [dispatch, gameID])

    function nextPlayer() {
        if (reviewData == null) {
            return
        }
        if (player + 1 >= reviewData.players.length) {
            // go to end game screen
        }
        setPlayer(player + 1)
    }

    if (reviewData == null) {
        return <p>Loading...</p>
    }

    // TODO: format all rounds of the game nicely!
    return (
        null
    )

}