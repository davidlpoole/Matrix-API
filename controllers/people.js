const peopleRouter = require('express').Router()
require('express-async-errors')
const Person = require('../models/person')



peopleRouter.get('/', async (request, response) => {
  const people = await Person
    .find({})
  response.json(people)
})

peopleRouter.get('/:id', async (request, response) => {
  const returnedPerson = await Person
    .findById(request.params.id)
  if (!returnedPerson) {
    return response.status(404).send({ error: 'person not found' })
  }
  response.json(returnedPerson)
})


peopleRouter.post('/', async (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    position: body.position,
    department: body.department,
    shift: body.shift,
    site: body.site,
    dateAdded: Date.now(),
    dateUpdated: Date.now()
  })

  if (
    !person.name ||
    !person.position ||
    !person.department ||
    !person.site
  ) {
    return response.status(400).send({ error: 'a required field is empty' })
  }

  const checkDupe = await Person.find({ 'name': person.name })
  if (checkDupe.length !== 0) {
    return response.status(400).send({ error: 'person name must be unique' })
  }

  const addedPerson = await person.save()
  response.status(201).json(addedPerson)
})


peopleRouter.put('/:id', async (request, response) => {
  const body = request.body

  // const personToUpdate = await Person
  //   .findById(request.params.id)

  const updatedPerson = {
    name: body.name,
    position: body.position,
    department: body.department,
    shift: body.shift,
    site: body.site,
    dateUpdated: Date.now()
  }
  const returnedPerson = await Person
    .findByIdAndUpdate(
      request.params.id,
      updatedPerson,
      {
        new: true,
        useFindAndModify: false
      }
    )

  if (!returnedPerson) {
    return response.status(404).send({ error: 'person not found' })
  } else {
    return response.status(204).json(returnedPerson)
  }
})


peopleRouter.delete('/:id', async (request, response) => {
  // const returnedPerson = await Person
  //   .findById(request.params.id)
  await Person.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

module.exports = peopleRouter