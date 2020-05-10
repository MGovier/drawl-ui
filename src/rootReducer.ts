import { combineReducers } from '@reduxjs/toolkit'

import gameStateReducer from './api/gameStateReducer'

const rootReducer = combineReducers({
  gameState: gameStateReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
