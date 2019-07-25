import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import PlayerPreview from './PlayerPreview'

function ResetButton (props) {
  return (
    <button className="reset"
            onClick={() => props.onReset(props.id)}>
      Reset
    </button>
  )
}

ResetButton.propTypes = {
  onReset: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

class PlayerInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  handleChange (event) {
    let value = event.target.value;
    this.setState(() => ({ username: value }));
  }

  handleSubmit (event) {
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
      <form className='column' onSubmit={this.handleSubmit}>
        <label className='header' htmlFor='username'>
          {label}
        </label>
        <input
          id='username'
           placeholder="GitHub username"
           type="text"
           autoComplete="off"
           value={username}
           onChange={this.handleChange}
        />
        <button
          className="button"
          type="submit"
          disabled={!username}>
            Submit
        </button>
      </form>
    )
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

class Battle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null
    }

    this.handleSubmit =
      this.handleSubmit.bind(this);

    this.handleReset =
      this.handleReset.bind(this);
  }

  handleSubmit(id, username) {
    this.setState(() => ({
      [id + 'Name']: username,
      [id + 'Image']: `https://github.com/${username}.png?size=200`
    }));
  }

  handleReset(id) {
    this.setState(() => ({
      [id + 'Name']: '',
      [id + 'Image']: null
    }));
  }

  render() {
    let { match } = this.props
    let { playerOneName, playerOneImage, playerTwoName, playerTwoImage } = this.state

    return (
      <div>
        <div className='row'>
          {!playerOneName &&
            <PlayerInput
              id='playerOne'
              label='Player One'
              onSubmit={this.handleSubmit}
            />}

          {playerOneImage !== null &&
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}>
                <ResetButton
                  onReset={this.handleReset}
                  id='playerOne' />
            </PlayerPreview>}

          {!playerTwoName &&
            <PlayerInput
              id='playerTwo'
              label='Player Two'
              onSubmit={this.handleSubmit}
            />}

          {playerTwoImage !== null &&
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}>
                <ResetButton
                  onReset={this.handleReset}
                  id='playerTwo' />
            </PlayerPreview>}
        </div>

        {playerOneImage && playerTwoImage &&
          <Link
            className='button'
            to={{
              pathname: match.url + '/results',
              search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}`
            }}>
              Battle
          </Link>}
      </div>
    )
  }
}

export default Battle;
