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

//@desc    Gets turbine by id
// @route   GET /api/turbines/:id
async function getTurbine(req, res, id) {
  try {
    const turbine = await Turbine.findById(id)
    if (turbine) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(turbine))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `Turbine with id ${id} not found` }))
    }
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

// @desc    Gets the private turbines for id
// @route   GET /api/turbines/private/:id
async function getPrivateTurbines(req, res, userId) {
  try {
    const privateTurbines = await Turbine.find({
      userId: userId,
      isPublic: false,
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(privateTurbines))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets a users private turbine with the specified name
// @route   GET /api/turbines/private/:id/:name
async function getPrivateTurbineByName(req, res, userId, name) {
  try {
    const privateTurbine = await Turbine.findOne({
      name: new RegExp('^' + name + '$', 'i'),
      userId: userId,
      isPublic: false,
    })

    if (!privateTurbine) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `Private Turbine with name ${name} not found`,
        })
      )
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(privateTurbine))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets a public turbine with the specified name
// @route   GET /api/turbines/private/:name
async function getPublicTurbineByName(req, res, name) {
  try {
    const publicTurbine = await Turbine.findOne({
      name: new RegExp('^' + name + '$', 'i'),
      isPublic: true,
    })

    if (!publicTurbine) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `Public Turbine with name ${name} not found`,
        })
      )
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(publicTurbine))
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getTurbines,
  getTurbine,
  getPublicTurbines,
  getPrivateTurbines,
  getPrivateTurbineByName,
  getPublicTurbineByName,
}
