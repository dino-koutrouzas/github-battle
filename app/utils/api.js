async function getProfile (username) {
  let response  = await fetch(`https://api.github.com/users/${username}`)
  return response.json()
}

async function getRepos (username) {
  let response  = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  return response.json()
}

function getStarCount (repos) {
  return repos.reduce((result, { stargazers_count }) => result + stargazers_count, 0);
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
    let results = await Promise.all(players.map(getUserData))

    return sortPlayers(results)
  } catch(err) {
    return handleError(err)
  }
}

export async function fetchPopularRepos (language) {
  let encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  try {
    let response = await fetch(encodedURI)
    let repos = await response.json()
    return repos.items
  } catch(err) {
    return handleError(err)
  }
}
