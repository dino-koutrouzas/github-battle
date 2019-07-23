var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');
var Loading = require('./Loading');

function RepoGrid (props) {
  return (
    <ul className="popular-list">
      {props.repos.map(function (repo, index) {
        return (
          <li className='popular-item'
              key={repo.name}>
            <div className='popular-rank'>#{index+1}</div>
            <ul className='space-list-items'>
              <li>
                <img className='avatar'
                     src={repo.owner.avatar_url}
                     alt={'Avatar for ' + repo.owner.login}/>
              </li>
              <li><a target="_blank" href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

function SelectLanguage (props) {
  let languages = ['All',
                   'JavaScript',
                   'Ruby',
                   'Java',
                   'CSS',
                   'Python']

  return (
    <ul className="languages">
      { languages.map(function(lang) {
        return (
          <li key={ lang }
              onClick={ props.onSelect.bind(null, lang) }
              style={
                props.selectedLanguage == lang ? { color: 'red' } : null
              }
              className="language">
            { lang }
          </li>
        )
      }) }
    </ul>
  )
}

SelectLanguage.propTyoes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    }

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount () {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(lang) {
    this.setState(() => {
      return {
        repos: null,
        selectedLanguage: lang
      }
    });

    api.fetchPopularRepos(lang)
      .then(function (repos) {
        this.setState(function () {
          return {
            repos: repos
          }
        })
      }.bind(this));
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage} />

        {!this.state.repos
        ? <Loading />
        : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

module.exports = Popular;
