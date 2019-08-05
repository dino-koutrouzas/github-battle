import React from 'react'
import PropTypes from 'prop-types'
import { ThemeConsumer } from '../contexts/theme'

function PlayerPreview ({ username, label, children }) {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className="column player">
          <h3 className="player-label">{label}</h3>
          <div className={`row bg-${theme}`}>
            <div className="player-info">
              <img
                className="avatar-small"
                src={`https://github.com/${username}.png?size=200`}
                alt={`Avatar for ${username}`}
              />

              <a
                href={`https://github.com/${username}`}
                className="link">
                @{username}
              </a>
            </div>

            {children}
          </div>
        </div>
      )}
    </ThemeConsumer>
  )
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default PlayerPreview;
