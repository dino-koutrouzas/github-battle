import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import Loading from './Loading'

function RepoGrid ( { repos }) {
  return (
    <ul className="popular-list">
      {repos.map(({ name, owner, html_url, stargazers_count }, index) => (
        <li className='popular-item'
            key={name}>
          <div className='popular-rank'>#{index+1}</div>
            <ul className='space-list-items'>
              <li>
                <img className='avatar'
                     src={owner.avatar_url}
                     alt={`Avatar for ${owner.login}`}/>
              </li>
              <li><a target="_blank" href={html_url}>{name}</a></li>
              <li>@{owner.login}</li>
              <li>{stargazers_count} stars</li>
            </ul>
          </li>
        )
      )}
    </ul>
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
        {error && <p>{error}</p>}
        {repos[selectedLanguage] &&
         <RepoGrid repos={repos[selectedLanguage]}/>}
      </div>
    )
  }
}

export default Popular;
