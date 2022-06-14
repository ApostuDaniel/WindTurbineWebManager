const fs = require('fs')
const ejs = require('ejs')
const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))

async function getCreateTurbinePage(req, res) {
  try {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var htmlContent = fs.readFileSync(
      __dirname + '/../views/pages/createTurbine.ejs',
      'utf8'
    )

    var htmlRenderized = ejs.render(htmlContent, {
      filename: 'createTurbine.ejs',
    })
    res.end(htmlRenderized)
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = { getCreateTurbinePage }
