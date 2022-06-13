const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.SchemaType.ObjectId,
    ref: 'User',
    required: true,
  },
  idTurbine: {
    type: mongoose.SchemaType.ObjectId,
    ref: 'Turbine',
    required: true,
  },
  timeStamp: { type: Date, required: true, default: () => Date.now() },
})

module.exports = mongoose.model('Alert', alertSchema)
