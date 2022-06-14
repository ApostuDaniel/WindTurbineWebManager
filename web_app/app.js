const http = require('http')
const fs = require('fs')
const ejs = require('ejs')
const PageController = require('./controllers/PageController')
const CretaeTurbineController = require('./controllers/CreateTurbineController')

const PORT = process.env.port || 5001

const server = http.createServer((req, res) => {
  try {
    if (req.url === '/pages/public') {
      PageController.getPublicPage(req, res)
<<<<<<< HEAD
    }
    else if (req.url === '/pages/owned')
      {
        PageController.getPrivatePage(req,res)
      }
    
    else {
=======
    } else 
    if (req.url === '/pages/createTurbine') {
      CretaeTurbineController.getCreateTurbinePage(req, res)
    } else {
>>>>>>> 7c3821a170978cdd92fe837a89badacb3dc699ec
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
