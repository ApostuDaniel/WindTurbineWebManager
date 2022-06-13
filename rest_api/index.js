const mongoose = require('mongoose')
const http = require('http')
const PORT = 5000
const User = require('./schemas/User')
const Turbine = require('./schemas/Turbine')
const AllTurbineData = require('./schemas/AllTurbineData')
const Notification = require('./schemas/Notification')
const Alert = require('./schemas/Alert')

mongoose.connect(
  'mongodb+srv://dandadan:proiect_web@cluster0.6dca8.mongodb.net/?retryWrites=true&w=majority'
)

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
