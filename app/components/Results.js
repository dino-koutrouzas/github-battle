import React from 'react'
import queryString from 'query-string'
import { battle } from '../utils/api'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import PlayerPreview from './PlayerPreview'
import Loading from './Loading'
import Card from './Card'
import Tooltip from './Tooltip'

import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaCode,
  FaUser } from 'react-icons/fa'

// has no state, doesn't need to be a class:
class ProfileList extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  }

  render () {
    const { profile } = this.props

    return (
      <ul className='card-list'>
        <li>
          <FaUser color='rgb(239, 115, 115)' size={22} />
          {profile.name}
        </li>
        {profile.location && (
          <li>
            <Tooltip text="User's location">
              <FaCompass color='rgb(144, 115, 255)' size={22} />
              {profile.location}
            </Tooltip>
          </li>
        )}
        {profile.company && (
          <li><Tooltip text="User's company">
            <FaBriefcase color='#795548' size={22} />
            {profile.company}
          </Tooltip>
          </li>
        )}
        <li>
          <FaUsers color='rgb(129, 195, 245)' size={22} />
          {profile.followers.toLocaleString()} followers
        </li>
        <li>
          <FaUserFriends color='rgb(64, 183, 95)' size={22} />
          {profile.following.toLocaleString()} following
        </li>
      </ul>
    )
  }
}

function Profile ({ info }) {
  let { avatar_url, login, name, location, company, followers, following, public_repos, blog } = info
  return (
    <PlayerPreview
      username={login}
      label={name}>
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
  state = {
    winner: null,
    loser: null,
    error: null,
    loading: true
  }

  async componentDidMount () {
    const { playerOne, playerTwo } =
          queryString.parse(this.props.location.search)

    try {
      const results = await battle([playerOne, playerTwo])

      this.setState(() => ({
        error: null,
        winner: results[0],
        loser: results[1],
        loading: false
      }))
    } catch({ message }) {
      this.setState(() => ({
        error: message,
        loading: false
      }))
    }
  }

  render () {
    const { error, winner, loser, loading } = this.state

    if (loading) { return <Loading /> }

    if (error) {
      return(
        <div>
          <p className="center-text error">{error}</p>
          <Link to="/battle">Reset</Link>
        </div>
      )
    }

    const tie = winner.score === loser.score

    return (
      <React.Fragment>
        <div className='grid space-around container-sm'>
          <Card
            header={tie ? 'Tie' : 'Winner'}
            subheader={`Score: ${winner.score.toLocaleString()}`}
            avatar={winner.profile.avatar_url}
            href={winner.profile.html_url}
            name={winner.profile.login}
          >
            <ProfileList profile={winner.profile} />
          </Card>

          <Card
            header={tie ? 'Tie' : 'Loser'}
            subheader={`Score: ${loser.score.toLocaleString()}`}
            avatar={loser.profile.avatar_url}
            href={loser.profile.html_url}
            name={loser.profile.login}
          >
            <ProfileList profile={loser.profile} />
          </Card>
        </div>

        <Link
          to={{pathname: '/battle'}}
          className="btn dark-btn btn-space"
        >
          Reset
        </Link>
      </React.Fragment>
    )
  }
}

export default Results;
