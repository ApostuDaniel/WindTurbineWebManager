const mongoose = require('mongoose')

const Turbine = require('./../schemas/Turbine')
const AllTurbineData = require('./../schemas/AllTurbineData')

async function getTurbines(req, res) {
  try {
    const turbines = await Turbine.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(turbines))
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getTurbines,
}
