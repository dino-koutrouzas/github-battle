import React from 'react'
import queryString from 'query-string'
import { battle } from '../utils/api'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import PlayerPreview from './PlayerPreview'
import Loading from './Loading'

function Profile ({ info }) {
  let { avatar_url, login, name, location, company, followers, following, public_repos, blog } = info
  return (
    <PlayerPreview
       avatar={avatar_url}
       username={login}
      >
        <ul className='space-list-items'>
          {name && <li>{name}</li>}
          {location && <li>{location}</li>}
          {company && <li>{company}</li>}
          <li>Followers: {followers}</li>
          <li>Following: {following}</li>
          <li>Public Repos: {public_repos}</li>
          {blog && <li><a href={blog}>{blog}</a></li>}
        </ul>
    </PlayerPreview>
  )
}

Profile.propTypes = {
  info: PropTypes.object.isRequired
}

function Player ({ label, score, profile }) {
  return (
    <div>
      <h1 className="header">{label}</h1>
      <h3 style={{textAlign: 'center'}}>Score: {score}</h3>
      <Profile info={profile} />
    </div>
  )
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired
}

class Results extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true
    }
  }

  componentDidMount () {
    let { playerOneName, playerTwoName} =
        queryString.parse(this.props.location.search)

    battle([
      playerOneName,
      playerTwoName
    ]).then(results => {
      results === null
        ? this.setState(() => ({ error: 'Ohhh dear...', loading: false }))
        : this.setState(() => ({
          error: null,
          winner: results[0],
          loser: results[1],
          loading: false
        }))
    });
  }

  render () {
    let { error, winner, loser, loading } = this.state

    if (loading) { return <Loading /> }

    if (error) {
      return(
        <div>
          <p>{error}</p>
          <Link to="/battle">Rest</Link>
        </div>
      )
    }

    return (
      <div className="row">
        <Player
           label="Winner"
           score={winner.score}
           profile={winner.profile}
        />
        <Player
           label="Loser"
           score={loser.score}
           profile={loser.profile}
        />
      </div>
    )
  }
}

export default Results;
