import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'nes.css/css/nes.min.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'

import store from './store'
import Footer from './components/Footer'

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <h1>Drawl!</h1>
          </header>
          <div id="content-window">
            <App />
          </div>
          <Footer />
        </div>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

render()

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./components/App', render)
}
