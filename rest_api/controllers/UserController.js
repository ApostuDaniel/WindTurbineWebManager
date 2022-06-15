const mongoose = require('mongoose')
const md5 = require('md5')
const {
  extractDateFromCNP,
  getRequestData,
  validateJSON,
} = require('./../utils')

const User = require('./../schemas/User')
const Notification = require('./../schemas/Notification')
const Alert = require('./../schemas/Alert')
const Turbine = require('./../schemas/Turbine')

// @desc    Gets All Users
// @route   GET /api/users
async function getUsers(req, res) {
  try {
    const users = await User.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets user by id
// @route   GET /api/users/:id
async function getUser(req, res, id) {
  try {
    const user = await User.findById(id)
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} not found` }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets user by mail
// @route   GET /api/users/mail/:mail
async function getUserByMail(req, res, mail) {
  try {
    const decodedMail = decodeURIComponent(mail)
    const user = await User.findOne({ mail: decodedMail })
    if (user) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      res.end(JSON.stringify(user))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ message: `User with mail ${decodedMail} not found` })
      )
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets All notifications
// @route   GET /api/users/notifications
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(notifications))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets All alerts
// @route   GET /api/users/alerts
async function getAlerts(req, res) {
  try {
    const alerts = await Alert.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(alerts))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets the notifications of user identified by id
// @route   GET /api/users/:id/notifications
async function getUserNotifications(req, res, id) {
  try {
    const user = await User.findById(id)
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} not found` }))
    } else {
      const notifications = await Notification.find({
        $or: [{ idBuyer: id }, { idSeller: id }],
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(notifications))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets the alerts of user identified by id
// @route   GET /api/users/:id/alerts
async function getUserAlerts(req, res, id) {
  try {
    const user = await User.findById(id)
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} not found` }))
    } else {
      const alerts = await Alert.where('idUser').equals(id)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(alerts))
    }
  } catch (error) {
    console.log(error)
  }
}

//POST

// @desc    POSTS a new user
// @route   POST /api/users
async function createUser(req, res) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const { firstName, lastName, company, CNP, mail, phone, adress, password } =
      JSON.parse(textBody)

    try {
      const user = await User.create({
        firstName,
        lastName,
        company,
        CNP,
        mail,
        phone,
        adress,
        birthDate: extractDateFromCNP(CNP),
        password: md5(password),
      })

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    POSTS a new notification
// @route   POST /api/users/notifications
async function createNotification(req, res) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const { idBuyer, idSeller, idTurbine } = JSON.parse(textBody)

    const buyer = await User.findById(idBuyer)
    const seller = await User.findById(idSeller)
    const turbine = await Turbine.findById(idTurbine)

    const noBuyer = buyer === null
    const noSeller = seller === null
    const noTurbine = turbine === null

    console.log(seller._id.oid)
    console.log(turbine.userId)
    console.log(seller._id == turbine.userId)
    if (noBuyer || noSeller || noTurbine || !(seller._id === turbine.userId)) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      const response = { message: '' }
      if (noBuyer) {
        response.message = `The buyer's id ${idBuyer} doesn't exist in the database`
      } else if (noSeller) {
        response.message = `The user's id ${idSeller} doesn't exist in the database`
      } else if (noTurbine) {
        response.message = `The turbine with id ${idSeller} doesn't exist in the database`
      } else {
        response.message = `The seller with id ${idSeller} doens't own the turbine ${idTurbine}`
      }
      res.end(JSON.stringify(response))

      return
    }

    try {
      const notification = await Notification.create({
        idBuyer,
        idSeller,
        idTurbine,
      })

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(notification))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  getUserNotifications,
  getUserAlerts,
  getNotifications,
  getAlerts,
  getUserByMail,
  createUser,
  createNotification,
}
