import React from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeConsumer } from '../contexts/theme'

const activeStyle = {
  color: 'red'
}

export default function Nav () {
  return (
    <ThemeConsumer>
      {({ theme, toggleTheme }) => (
        <nav className='row space-between'>
          <ul className="row nav">
            <li>
              <NavLink
                className="nav-link"
                activeStyle={activeStyle}
                to="/battle"
              >
                Battle
              </NavLink>
            </li>
            <li>
              <NavLink
                className="nav-link"
                activeStyle={activeStyle}
                exact
                to="/"
              >
                Popular
              </NavLink>
            </li>
          </ul>

          <button
            style={{fontSize: 30}}
            className='btn-clear'
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🔦' : '💡'}
          </button>
        </nav>
      )}
    </ThemeConsumer>
  );
}
