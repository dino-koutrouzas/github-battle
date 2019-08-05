import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import PlayerPreview from './PlayerPreview'
import Results from './Results'
import {
  FaUserFriends,
  FaFighterJet,
  FaTrophy,
  FaTimesCircle
} from 'react-icons/fa'
import { ThemeConsumer } from '../contexts/theme'

ResetButton.propTypes = {
  onReset: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

function ResetButton (props) {
  return (
    <button className="btn-clear flex-center"
            onClick={() => props.onReset(props.id)}>
      <FaTimesCircle color='rgb(194, 57, 42)' size={26} />
    </button>
  )
}

class PlayerInput extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    label: 'Username'
  }

  state = {
    username: ''
  }

  handleChange = (event) => {
    const value = event.target.value;
    this.setState(() => ({ username: value }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(
      this.props.id,
      this.state.username
    )
  }

  render () {
    let { username } = this.state
    let { label } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <form
            className='column player'
            onSubmit={this.handleSubmit}>
            <label className='player-label' htmlFor='username'>
              {label}
            </label>
            <div className="row player-inputs">
              <input
                id='username'
                className={`input-${theme}`}
                placeholder="GitHub username"
                type="text"
                autoComplete="off"
                value={username}
                onChange={this.handleChange}
              />
              <button
                className={`btn ${theme === 'light' ? 'dark' : 'light' }-btn`}
                type="submit"
                disabled={!username}>
                Submit
              </button>
            </div>
          </form>
        )}
      </ThemeConsumer>
    )
  }
}

function Instructions () {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className="instructions-container">
          <h1 className="center-text header-lg">
            Instructions
          </h1>

          <ol className="container-sm grid center-text battle-instructions">
            <li>
              <h3 className="header-sm">
                Enter two GitHub users
              </h3>
              <FaUserFriends
                className={`bg-${theme}`}
                color='rgb(255, 191, 116)'
                size={140}
              />
            </li>
            <li>
              <h3 className='header-sm'>Battle</h3>
        <FaFighterJet className={`bg-${theme}`} color='#727272' size={140} />
            </li>
            <li>
              <h3 className='header-sm'>See the winners</h3>
              <FaTrophy className={`bg-${theme}`} color='rgb(255, 215, 0)' size={140} />
            </li>
          </ol>
        </div>
      )}
    </ThemeConsumer>
  )
}

class Battle extends React.Component {
  state = {
    playerOne: null,
    playerTwo: null,
  }

  handleSubmit = (id, player) => {
    this.setState(() => ({
      [id]: player
    }));
  }

  handleReset = (id) => {
    this.setState(() => ({
      [id]: null
    }));
  }

  render() {
    let { match } = this.props
    const { playerOne, playerTwo, battle } = this.state

    return (
      <React.Fragment>
        <Instructions />
        <div className='players-container'>
          <h1 className="center-text header-lg">Players</h1>
          <div className="row space-around">
            {!playerOne
             ? <PlayerInput
                 id='playerOne'
                 label='Player One'
                 onSubmit={this.handleSubmit}
               />
             : <PlayerPreview
                 username={playerOne}
                 label={'Player 1'}>
                 <ResetButton
                   onReset={this.handleReset}
                   id='playerOne' />
               </PlayerPreview> }

            {!playerTwo
             ? <PlayerInput
                 id='playerTwo'
                 label='Player Two'
                 onSubmit={this.handleSubmit}
                           />
             : <PlayerPreview
                 username={playerTwo}
                 label={'Player 2'}>
                 <ResetButton
                   onReset={this.handleReset}
                   id='playerTwo' />
               </PlayerPreview> }
          </div>
        </div>

        {playerOne && playerTwo &&
         <Link
           className='btn dark-btn btn-space'
           to={{
             pathname: `${match.url}/results`,
             search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
           }}
         >
           Battle
         </Link>}
      </React.Fragment>
    )
  }
}

export default Battle;
