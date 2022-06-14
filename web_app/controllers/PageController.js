const fs = require('fs')
const ejs = require('ejs')
const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))

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

module.exports = { getPublicPage }
