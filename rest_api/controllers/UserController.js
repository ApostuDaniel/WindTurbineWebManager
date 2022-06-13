const mongoose = require('mongoose')

const User = require('./../schemas/User')
const Notification = require('./../schemas/Notification')
const Alert = require('./../schemas/Alert')

async function getUsers(req, res) {
  try {
    const users = await User.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users))
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getUsers }
