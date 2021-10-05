const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const matrixSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  dateCompleted: { type: String },
  dateAdded: { type: Date },
  dateUpdated: { type: Date },
})

matrixSchema.plugin(uniqueValidator)

matrixSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Matrix = mongoose.model('Matrix', matrixSchema)
module.exports = Matrix