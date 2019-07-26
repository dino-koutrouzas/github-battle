import axios from 'axios'

async function getProfile (username) {
  let { data } = await axios.get(`https://api.github.com/users/${username}`)
  return data
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
}

function getStarCount (repos) {
  return repos.data.reduce((result, { stargazers_count }) => result + stargazers_count, 0);
}

function calculateScore ({ followers }, repos) {
  return (followers * 3) + getStarCount(repos);
}

function handleError (error) {
  console.warn(error);
  return null
}

async function getUserData (player) {
  let [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ])

  return {
    profile: profile,
    score: calculateScore(profile, repos)
  }
}

function sortPlayers (players) {
  return players.sort((a, b) => b.score - a.score);
}

export async function battle (players) {
  try {
    let players = await Promise.all(players.map(getUserData))
    return sortPlayers(players)
  } catch(err) {
    return handleError(err)
  }
}

export async function fetchPopularRepos (language) {
  let encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  try {
    let { data } = await axios.get(encodedURI)
    return data.items
  } catch(err) {
    return handleError(err)
  }
}
