import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import Loading from './Loading'
import Card from './Card'
import Tooltip from './Tooltip'

import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle
} from 'react-icons/fa'

function RepoGrid ( { repos }) {
  return (
    <div className="grid space-around">
      {repos.map(({
        name,
        owner,
        html_url,
        stargazers_count,
        forks,
        open_issues
      }, index) => (
        <Card
          header={`#${index+1}`}
          avatar={owner.avatar_url}
          href={html_url}
          name={name}
          key={owner.name + name}
        >
          <ul className="card-list">
            <li>
              <Tooltip text="GitHub username">
                <FaUser
                  color='rgb(255, 191, 116)'
                  size={22} />
                <a href={`https://github.com/${owner.login}`}>{owner.login}</a>
              </Tooltip>
            </li>
            <li>
              <FaStar
                color='rgb(255, 215, 0)'
                size={22} />
              {stargazers_count.toLocaleString()} stars
            </li>
            <li>
              <FaCodeBranch
                color='rgb(129, 195, 245)'
                size={22} />
              {forks.toLocaleString()} forks
            </li>
            <li>
              <FaExclamationTriangle
                color='rgb(241, 138, 147)'
                size={22} />
              {open_issues.toLocaleString()} open
            </li>
          </ul>
        </Card>
      )
                )}
    </div>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

function LanguagesNav ({ selectedLanguage, onSelect }) {
  const languages = ['All',
                     'JavaScript',
                     'Ruby',
                     'Java',
                     'CSS',
                     'Python']

  return (
    <ul className="flex-center">
      {languages.map(lang => {
        return (
          <li
            key={lang}
            onClick={() => onSelect(lang)}
            style={selectedLanguage === lang
                   ? { color: 'red' }
                   : null}
          >
            <button className="btn-clear nav-link">
              {lang}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

LanguagesNav.propTyoes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null
  }

  componentDidMount () {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage = async (lang) => {
    this.setState(() => ({
      error: null,
      selectedLanguage: lang
    }));

    if (!this.state.repos[lang]) {
      try {
        const data = await fetchPopularRepos(lang)

        this.setState(({ repos }) => ({
          repos: {
            ...repos,
            [lang]: data
          },
          error: null
        }));
      } catch(err) {
        this.setState({error: err.message})
      }
    }
  }

  isLoading = () => {
    const { selectedLanguage, repos, error } = this.state

    return !repos[selectedLanguage] && error === null
  }

  render() {
    const { selectedLanguage, repos, error } = this.state

    return (
      <div>
        <LanguagesNav
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage} />

        {this.isLoading() && <Loading />}
        {error && <p className="center-text error">
        {error}
      </p>}
        {repos[selectedLanguage] &&
         <RepoGrid repos={repos[selectedLanguage]}/>}
      </div>
    )
  }
}

export default Popular;
