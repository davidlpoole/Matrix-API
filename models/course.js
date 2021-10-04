const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name: {
    type: String
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
    type: Date
  },
  dateUpdated: {
    type: Date
  },
})

courseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course