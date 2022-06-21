const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))
  
async function getAllCompanies() {
  const data = await fetch(`http://localhost:5000/api/users`)
  const users = await data.json()

  return users.map((user) => user.company)
}

async function filterPublicTurbines(query){
  const data = await fetch(`http://localhost:5000/api/turbines/filter${query}`)
  const filteredTurbines = await data.json()
  return filteredTurbines
}

async function filterPrivateTurbines(id, query){
  const data = await fetch(`http://localhost:5000/api/turbines/filter/${id}${query}`)
  const filteredTurbines = await data.json()
  return filteredTurbines
}

module.exports = {
  getAllCompanies,
  filterPublicTurbines,
  filterPrivateTurbines,
}
