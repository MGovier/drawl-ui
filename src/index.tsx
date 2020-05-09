import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'nes.css/css/nes.min.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <header className="App-header">
        <h1>Drawl!</h1>
        <div id="content-window">
          <App />
        </div>
      </header>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
