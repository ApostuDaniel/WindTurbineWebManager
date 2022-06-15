
const fs = require('fs')
const ejs = require('ejs')


const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))

async function getLandingPage(req, res) {
  try {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var htmlContent = fs.readFileSync(
      __dirname + '/../views/pages/landing.ejs',
      'utf8'
    )

    var htmlRenderized = ejs.render(htmlContent, {
      filename: 'landing.ejs',
    })
    
    res.end(htmlRenderized)
  } catch (error) {
    console.log(error.message)
  }
}

async function getPublicPage(req, res) {
  try {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var htmlContent = fs.readFileSync(
      __dirname + '/../views/pages/public.ejs',
      'utf8'
    )

    const turbineData = await getTurbines()

    var htmlRenderized = ejs.render(htmlContent, {
      filename: 'public.ejs',
      turbines: turbineData,
    })
    
    res.end(htmlRenderized)
  } catch (error) {
    console.log(error.message)
  }
}


async function getTurbines() {
  const data = await fetch('http://localhost:5000/api/turbines')
  const turbineData = await data.json()

  return turbineData
}

async function getPrivatePage(req, res, id) {
  try {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var htmlContent = fs.readFileSync(
      __dirname + '/../views/pages/owned.ejs',
      'utf8'
    )

    
    const ownedTurbineData = await getOwnedTurbines(id)

    var htmlRenderized = ejs.render(htmlContent, {
      filename: 'owned.ejs',
      turbines: ownedTurbineData,
    })
    
    res.end(htmlRenderized)
  } catch (error) {
    console.log(error.message)
  }
}


async function getAuthPage(req, res) {
  try {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var htmlContent = fs.readFileSync(
      __dirname + '/../views/pages/auth.ejs',
      'utf8'
    )

    
   

    var htmlRenderized = ejs.render(htmlContent, {
      filename: 'auth.ejs',
    })
    
    res.end(htmlRenderized)
  } catch (error) {
    console.log(error.message)
  }
}

async function getTurbines() {
  const data = await fetch('http://localhost:5000/api/turbines/public')
  const turbineData = await data.json()

  return turbineData
}

async function getOwnedTurbines(id)
{
  const data = await fetch('http://localhost:5000/api/turbines/private/'+id) // hardcoded user id
  const ownedTurbineData=await data.json()

  return ownedTurbineData
}

module.exports = { getPublicPage, getPrivatePage, getAuthPage, getLandingPage, getOwnedTurbines }
