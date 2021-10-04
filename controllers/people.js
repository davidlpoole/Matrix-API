const peopleRouter = require('express').Router()
require('express-async-errors')
const Person = require('../models/person')



peopleRouter.get('/', async (request, response) => {
  const people = await Person
    .find({})
  return response.json(people)
})

peopleRouter.get('/:id', async (request, response) => {
  const returnedPerson = await Person
    .findById(request.params.id)
  if (!returnedPerson) {
    return response.status(404).end()
  }
  return response.json(returnedPerson)
})


peopleRouter.post('/', async (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    position: body.position,
    site: body.site,
    department: body.department,
    shift: body.shift,
    dateAdded: Date.now(),
    dateUpdated: Date.now()
  })

  if (
    !person.name ||
    !person.position ||
    !person.department ||
    !person.site
  ) {
    return response.status(400).end()
  }

  const checkDupe = await Person.find({ 'name': person.name })
  if (checkDupe.length !== 0) {
    return response.status(400).end()
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
    site: body.site,
    department: body.department,
    shift: body.shift,
    dateUpdated: Date.now()
  }
  const returnedPerson = await Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
  return response.json(returnedPerson)
})


peopleRouter.delete('/:id', async (request, response) => {
  // const returnedPerson = await Person
  //   .findById(request.params.id)
  await Person.findByIdAndRemove(request.params.id)
  return response.status(204).end()
})

module.exports = peopleRouter