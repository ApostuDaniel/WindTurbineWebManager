const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  idBuyer: {
    type: mongoose.SchemaType.ObjectId,
    ref: 'User',
    required: true,
  },
  idSeller: {
    type: mongoose.SchemaType.ObjectId,
    ref: 'User',
    required: true,
  },
  idTurbine: {
    type: mongoose.SchemaType.ObjectId,
    ref: 'Turbine',
    required: true,
  },
})

module.exports = mongoose.model('Notification', notificationSchema)
