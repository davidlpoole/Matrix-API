const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const positionSchema = new mongoose.Schema({
  position: String,
  department: String,
  site: String,
  manager: String,
  shift: String,
})

positionSchema.plugin(uniqueValidator)

positionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Position = mongoose.model('Position', positionSchema)
module.exports = Position