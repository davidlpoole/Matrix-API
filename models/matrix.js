const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const matrixSchema = new mongoose.Schema({
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  position: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
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