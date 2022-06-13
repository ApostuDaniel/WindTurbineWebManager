const mongoose = require('mongoose')
const User = require('./schemas/User')
const Turbine = require('./schemas/Turbine')
const TurbineData = require('./schemas/TurbineData')
const AllTurbineData = require('./schemas/AllTurbineData')
const Notification = require('./schemas/Notification')
const Alert = require('./schemas/Alert')

mongoose.connect(
  'mongodb+srv://dandadan:proiect_web@cluster0.6dca8.mongodb.net/?retryWrites=true&w=majority'
)

const run = async () => {
  try {
    const user = await User.findById('62a714f178c1580fbabd1960')
    console.log(user)
  } catch (e) {
    console.log(e.message)
  }
}

run()
