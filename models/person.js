const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: { type: String },
  site: { type: String },
  department: { type: String },
  shift: { type: String },
  position: { type: String },
  dateAdded: { type: Date },
  dateUpdated: { type: Date },
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
module.exports = Person