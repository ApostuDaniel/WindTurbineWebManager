const mongoose = require('mongoose')
const TurbineData = require('./TurbineData')

const allTurbineDataSchema = new mongoose.Schema({
  turbineId: {
    type: mongoose.SchemaType.ObjectId,
    ref: 'Turbine',
    required: true,
  },
  historicData: [TurbineData],
})

module.exports = mongoose.Model('AllTurbineData', allTurbineDataSchema)
