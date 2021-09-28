const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  category: {
    type: String,
  },
  provider: {
    type: String
  },
  expiry: {
    type: Number
  },
  duration: {
    type: Number
  },
  dateAdded: {
    type: Date,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: true
  },
})

courseSchema.plugin(uniqueValidator)

courseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course