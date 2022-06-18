const mongoose = require('mongoose')
const Turbine = require('./../schemas/Turbine')
const AllTurbineData = require('./../schemas/AllTurbineData')
const User = require('./../schemas/User')
const Alert = require('./../schemas/Alert')
const Notification = require('./../schemas/Notification')

const { getRequestData, validateJSON } = require('../utils')

//GET

// @desc    Gets All turbines
// @route   GET /api/turbines
async function getTurbines(req, res) {
  try {
    const turbines = await Turbine.find()
    res.writeHead(200, {
      'Content-Type': 'application/json',
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

// @desc    Gets all the time data for turbine with :id
// @route   GET /api/turbines/data/:id
async function getTurbineData(req, res, id) {
  try {
    const turbineData = await AllTurbineData.findOne({ turbineId: id })
    if (turbineData) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(turbineData))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ message: `No Turbine Data for turbine id ${id}` })
      )
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets the newest registered data for turbine with :id
// @route   GET /api/turbines/data/:id/new
async function getNewestTurbineData(req, res, id) {
  try {
    const turbineData = await AllTurbineData.findOne({ turbineId: id })
    if (
      turbineData &&
      turbineData.historicData != null &&
      turbineData.historicData.length > 0
    ) {
      res.writeHead(200, { 'Content-Type': 'application/json' })

      res.end(JSON.stringify(turbineData.historicData.slice(-1)[0]))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ message: `No Turbine Data for turbine id ${id}` })
      )
    }
  } catch (error) {
    console.log(error)
  }
}

//POST

// @desc    POSTS a new turbine
// @route   POST /api/turbines

async function createTurbine(req, res) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const {
      userId,
      name,
      constructionYear,
      imageLink,
      latitude,
      longitude,
      altitude,
      terrain,
      suitability,
      isPublic,
      turbineState,
    } = jsonBody

    const user = await User.findById(userId)

    if (user == null) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `The referenced userId ${userId} doesn't exist in the database`,
        })
      )
      return
    }

    try {
      const turbine = await Turbine.create({
        userId,
        name,
        constructionYear,
        imageLink,
        latitude,
        longitude,
        altitude,
        terrain,
        suitability,
        isPublic,
        turbineState,
      })

      const turbineData = await AllTurbineData.create({
        turbineId: turbine._id,
        historicData: [],
      })

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(turbine))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

//PUT

// @desc    Puts a new turbine data instance in AllTurbineData
// @route   PUT /api/turbines/newdata/:id
//id - AllTurbineData.turbineId

async function postNewData(req, res, id) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    let turbineData = await AllTurbineData.findOne({ turbineId: id })
    const turbine = await Turbine.findById(id)

    if (turbine === null) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `The referenced turbine with id ${id} doesn't exist in the database`,
        })
      )
      return
    } else if (turbineData === null) {
      turbineData = await AllTurbineData.create({
        turbineId: turbine._id,
        historicData: [],
      })
    }

    try {
      const newTurbineData = jsonBody

      if (turbineData.historicData.length >= 144) {
        turbineData.historicData.shift()
      }

      turbineData.historicData.push(newTurbineData)
      await turbineData.save()

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(turbineData.historicData.slice(-1)[0]))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    UPDATES a turbine
// @route   PUT /api/turbines/:id

async function updateTurbine(req, res, id) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const turbine = await Turbine.findById(id)

    if (turbine == null) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `Turbine with id ${id} doesn't exist in the database`,
        })
      )
      return
    }

    try {
      for (prop in turbine) {
        turbine[prop] = jsonBody[prop] ?? turbine[prop]
      }

      await turbine.save()

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(turbine))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

async function deleteTurbine(req, res, id) {
  try {
    await helperDeleteTurbineRelatedData(id)
    res.writeHead(204, { 'Content-Type': 'application/json' })
    res.end()
  } catch (error) {
    console.log(error)
  }
}

async function helperDeleteTurbineRelatedData(id) {
  await AllTurbineData.findOneAndDelete({ turbineId: id })
  await Alert.deleteMany({ idTurbine: id })
  await Notification.deleteMany({ idTurbine: id })
  await Turbine.findByIdAndDelete(id)
}

module.exports = {
  getTurbines,
  getTurbine,
  getPublicTurbines,
  getPrivateTurbines,
  getPrivateTurbineByName,
  getPublicTurbineByName,
  getTurbineData,
  getNewestTurbineData,
  createTurbine,
  postNewData,
  updateTurbine,
  helperDeleteTurbineRelatedData,
  deleteTurbine,
}
