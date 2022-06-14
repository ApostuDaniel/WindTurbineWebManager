const mongoose = require('mongoose')
const http = require('http')
const userController = require('./controllers/UserController')
const turbineController = require('./controllers/TurbineController')
const PORT = process.env.port || 5000

// const User = require('./schemas/User')
// const Turbine = require('./schemas/Turbine')
// const AllTurbineData = require('./schemas/AllTurbineData')
// const Notification = require('./schemas/Notification')
// const Alert = require('./schemas/Alert')

mongoose.connect(
  'mongodb+srv://dandadan:proiect_web@cluster0.6dca8.mongodb.net/?retryWrites=true&w=majority'
)

const server = http.createServer((req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        if (req.url === '/api/users') {
          userController.getUsers(req, res)
        } else if (req.url.match(/\/api\/users\/\w+$/)) {
          const id = req.url.split('/')[3]
          userController.getUser(req, res, id)
        } else if (req.url.match(/\/api\/users\/notifications$/)) {
          const id = req.url.split('/')[3]
          userController.getUser(req, res, id)
        } else if (req.url.match(/\/api\/users\/alerts$/)) {
          const id = req.url.split('/')[3]
          userController.getUser(req, res, id)
        } else if (req.url.match(/\/api\/users\/\w+\/notifications$/)) {
          const id = req.url.split('/')[3]
          userController.getUserNotifications(req, res, id)
        } else if (req.url.match(/\/api\/users\/\w+\/alerts$/)) {
          const id = req.url.split('/')[3]
          userController.getUserAlerts(req, res, id)
        } else if (req.url === '/api/turbines') {
          turbineController.getTurbines(req, res)
        } else if (req.url === '/api/turbines/public') {
          turbineController.getPublicTurbines(req, res)
        } else if (req.url === '/api/turbines/private') {
          turbineController.getPrivateTurbines(req, res)
        } else {
          throw new Error('GET route not found')
        }
        break
      case 'POST':
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<h1>Header</h1>')
        break
      case 'PUT':
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<h1>Header</h1>')
        break
      case 'DELETE':
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<h1>Header</h1>')
        break
      default:
        throw new Error('Unacceptable http verb')
    }
  } catch (error) {
    console.log(error)
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Route Not Found' }))
  }
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// const run = async () => {
//   try {
//     const user = await User.findById('62a711d36884262d4629fa3d')

//     const turbine = await Turbine.create({
//       userId: user._id,
//       name: 'New Turbine',
//       constructionYear: Date.now(),
//       imageLink: ' https://www.example.com/images/dinosaur.jpg',
//       latitude: 25.4,
//       longitude: 32.5,
//       altitude: 100,
//       terrain: 'cernoziom',
//       suitability: 100,
//       isPublic: true,
//       turbineState: 'Running',
//     })

//     await turbine.save()
//     const allTurbineData = new AllTurbineData({
//       turbineId: turbine._id,
//       historicData: [
//         {
//           windSpeed: 50,
//           turbineWear: 5,
//           powerGenerated: 15,
//           eficiency: 0.9,
//           timeStamp: Date.now(),
//         },
//       ],
//     })

//     await allTurbineData.save()

//     const notification = new Notification({
//       idBuyer: '62a71082688cdb968577decf',
//       idSeller: user._id,
//       idTurbine: turbine._id,
//     })

//     await notification.save()

//     const alert = new Alert({
//       idUser: '62a71082688cdb968577decf',
//       idTurbine: turbine._id,
//     })

//     await alert.save()

//     console.log(user)
//     console.log(turbine)
//     console.log(allTurbineData)
//     console.log(notification)
//     console.log(alert)
//   } catch (e) {
//     console.log(e.message)
//   }
// }

// run()
