const http = require('http')
const fs = require('fs')
const ejs = require('ejs')
const PageController = require('./controllers/PageController')
const CreateTurbineController = require('./controllers/CreateTurbineController')

const PORT = process.env.port || 5001

const server = http.createServer((req, res) => {
  try {
    if (req.url === '/pages/public') {
      PageController.getPublicPage(req, res)
    }
    else if (req.url.match(/\/pages\/owned\/\w+$/)) {
      const id=req.url.split('/')[3];
      
      PageController.getPrivatePage(req,res,id)
    } 
    else if(req.url === '/pages/createTurbine') {
      CreateTurbineController.getCreateTurbinePage(req,res)
    }
    else if (req.url=== '/pages/auth')
    {
      PageController.getAuthPage(req,res)
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('<h1>404 NOT FOUND</h1>')
    }
  } catch (error) {
    console.log(error)
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Route Not Found' }))
  }
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
