const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))
  
async function getAllCompanies() {
  const data = await fetch(`http://localhost:5000/api/users`)
  const users = await data.json()

  return users.map((user) => user.company)
}

module.exports = { getAllCompanies }
