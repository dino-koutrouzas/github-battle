function getErrorMessage(message, username) {
  if (message === 'Not Found') return `${username} doesn't exist!`
}

async function getProfile (username) {
  const response  = await fetch(`https://api.github.com/users/${username}`)
  const profile = await response.json()

  if (profile.message) {
    throw new Error(getErrorMessage(profile.message, username))
  } else {
    return profile
  }
}

async function getRepos (username) {
  const response  = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  const repos = await response.json()

  if (repos.message) {
    throw new Error(getErrorMessage(repos.message, username))
  } else {
    return repos
  }
}

function getStarCount (repos) {
  return repos.reduce((result, { stargazers_count }) => {
    return result + stargazers_count, 0
  })
}

function calculateScore ({ followers }, repos) {
  return (followers * 3) + getStarCount(repos);
}

function handleError (error) {
  console.warn(error);
  return null
}

async function getUserData (player) {
  const [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ])

  return {
    profile: profile,
    score: calculateScore(profile, repos)
  }
}

function sortPlayers (players) {
  return players.sort((a, b) => b.score - a.score)
}

export async function battle (players) {
  const results = await Promise.all(players.map(getUserData))
  return sortPlayers(results)
}

export async function fetchPopularRepos (language) {
  const encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  let response = await fetch(encodedURI)
  let repos = await response.json()

  if (!repos.items) {
    throw new Error(repos.message)
  } else {
    return repos.items
  }
}
