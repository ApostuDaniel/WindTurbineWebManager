const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String, required: true, unique: true },
  CNP: { type: String, required: true, unique: true },
  mail: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: (email) =>
        String(email)
          .toLocaleLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
      message: (props) => `${props} deemed invalid by email regex`,
    },
  },
  phone: { type: String, required: true, unique: true },
  adress: String,
  birthDate: Date,
  password: { type: String, required: true },
})

module.exports = mongoose.model('User', userSchema)
