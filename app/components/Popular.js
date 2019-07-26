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

function SelectLanguage ({ selectedLanguage, onSelect }) {
  let languages = ['All',
                   'JavaScript',
                   'Ruby',
                   'Java',
                   'CSS',
                   'Python']

  return (
    <ul className="languages">
      {languages.map(lang => {
        return (
          <li
              key={lang}
              onClick={() => onSelect(lang)}
              style={selectedLanguage === lang ? { color: 'red' } : null}
              className="language"
           >
             {lang}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTyoes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: null
  }

  componentDidMount () {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage = (lang) => {
    this.setState(() => ({
      repos: null,
      selectedLanguage: lang
    }));

    fetchPopularRepos(lang)
      .then(repos => this.setState(() => ({ repos })));
  }

  render() {
    let { selectedLanguage, repos } = this.state

    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage} />

        {!repos
           ? <Loading />
           : <RepoGrid repos={repos} />}
      </div>
    )
  }
}

export default Popular;
