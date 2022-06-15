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

module.exports = {
  getUsers,
  getUser,
  getUserNotifications,
  getUserAlerts,
  getNotifications,
  getAlerts,
  getUserByMail,
  createUser,
}
