const mongoose = require('mongoose')

const Turbine = require('./../schemas/Turbine')
const AllTurbineData = require('./../schemas/AllTurbineData')

// @desc    Gets All turbines
// @route   GET /api/turbines
async function getTurbines(req, res) {
  try {
    const turbines = await Turbine.find()
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
    res.end(JSON.stringify(turbines))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets public turbines
// @route   GET /api/turbines/public
async function getPublicTurbines(req, res) {
  try {
    const publicTurbines = await Turbine.find({ isPublic: true })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(publicTurbines))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets private turbines
// @route   GET /api/turbines/private
async function getPrivateTurbines(req, res) {
  try {
    const privateTurbines = await Turbine.find({ isPublic: false })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(privateTurbines))
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getTurbines,
  getPublicTurbines,
  getPrivateTurbines,
}
