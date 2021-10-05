const recordsRouter = require('express').Router()
require('express-async-errors')
const Record = require('../models/record')



recordsRouter.get('/', async (request, response) => {
  const records = await Record
    .find({})
  response.json(records)
})

recordsRouter.get('/:id', async (request, response) => {
  const returnedRecord = await Record
    .findById(request.params.id)
    .populate('person', {})
    .populate('course', {})
  if (!returnedRecord) {
    return response.status(404).send({ error: 'record not found' })
  }
  response.json(returnedRecord)
})


recordsRouter.post('/', async (request, response) => {
  const body = request.body

  const record = new Record({
    person: body.person,
    course: body.course,
    dateCompleted: body.dateCompleted,
    dateAdded: Date.now(),
    dateUpdated: Date.now()
  })

  if (
    !record.person ||
    !record.course ||
    !record.dateCompleted
  ) {
    return response.status(400).send({ error: 'a required field is empty' })
  }

  const addedRecord = await record.save()
  response.status(201).json(addedRecord)
})


recordsRouter.put('/:id', async (request, response) => {
  const body = request.body

  if (
    !record.person ||
    !record.course ||
    !record.dateCompleted
  ) {
    return response.status(400).send({ error: 'a required field is empty' })
  }

  const updatedRecord = {
    person: body.person,
    course: body.course,
    dateCompleted: body.dateCompleted,
    dateUpdated: Date.now()
  }
  const returnedRecord = await Record
    .findByIdAndUpdate(
      request.params.id,
      updatedRecord,
      {
        new: true,
        useFindAndModify: false
      }
    )

  if (!returnedRecord) {
    return response.status(404).send({ error: 'record not found' })
  } else {
    return response.status(204).json(returnedRecord)
  }
})


recordsRouter.delete('/:id', async (request, response) => {
  // const returnedRecord = await Record
  //   .findById(request.params.id)
  await Record.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

module.exports = recordsRouter