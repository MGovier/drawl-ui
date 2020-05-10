import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import reduxWebsocket from '@giantmachines/redux-websocket'

import rootReducer, { RootState } from './rootReducer'


const reduxGameStreamWSMiddleware = reduxWebsocket({
    reconnectOnClose: true, 
    reconnectInterval: 10000,
    prefix: "GAME_STREAM"
  })
  
  const store = configureStore({
    reducer: rootReducer,
    middleware: [ reduxGameStreamWSMiddleware, ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'meta.timestamp', 'payload'] // v2 pls
      },
    })]
  })

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store