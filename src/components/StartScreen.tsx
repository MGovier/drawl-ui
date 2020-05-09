import React from 'react'

function StartScreen() {
  return (
      <>
      <p>
        Drawl is a multiplayer party game where you take turns drawing a phrase and guessing what is in front of you!
      </p>
      <p>
        Everyone needs their own device to draw on. One player starts the game, and then everyone else can use the code
        to join.
      </p>
      <form>
        <div style={{ display: 'flex' }}>
          <div className="nes-field" style={{ maxWidth: '70%', margin: 'auto', minWidth: '12rem' }}>
            <label htmlFor="game_id">Game ID</label>
            <input type="text" id="game_id" className="nes-input" />
          </div>
          <button type="submit" style={{ width: '6rem', margin: 'auto', marginTop: '32px', height: '48px' }} className="nes-btn is-primary">
            Join
          </button>
        </div>
      </form>
      <p style={{padding: '2rem', textAlign: 'center', margin: 'auto'}}>Or...</p>
      <button type="button" className="nes-btn is-primary" style={{margin: '0 auto', display: 'block'}}>Start a New Game</button>
    </>
  )
}

export default StartScreen
