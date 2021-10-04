const coursesRouter = require('express').Router()
require('express-async-errors')
const Course = require('../models/course')



coursesRouter.get('/', async (request, response) => {
  const courses = await Course
    .find({})
  response.json(courses)
})

coursesRouter.get('/:id', async (request, response) => {
  const returnedCourse = await Course
    .findById(request.params.id)
  if (!returnedCourse) {
    return response.status(404).send({ error: 'course not found' })
  }
  response.json(returnedCourse)
})


coursesRouter.post('/', async (request, response) => {
  const body = request.body

  const course = new Course({
    name: body.name,
    category: body.category,
    provider: body.provider,
    expiry: body.expiry || null,
    duration: body.duration,
    dateAdded: Date.now(),
    dateUpdated: Date.now()
  })

  if (
    !course.name ||
    !course.category ||
    !course.provider
  ) {
    return response.status(400).send({ error: 'a required field is empty' })
  }

  const checkDupe = await Course.find({ 'name': course.name })
  if (checkDupe.length !== 0) {
    return response.status(400).send({ error: 'course name must be unique' })
  }

  const addedCourse = await course.save()
  response.status(201).json(addedCourse)
})


coursesRouter.put('/:id', async (request, response) => {
  const body = request.body

  // const courseToUpdate = await Course
  //   .findById(request.params.id)

  const updatedCourse = {
    name: body.name,
    category: body.category,
    provider: body.provider,
    expiry: body.expiry || null,
    duration: body.duration,
    dateUpdated: Date.now()
  }
  const returnedCourse = await Course
    .findByIdAndUpdate(
      request.params.id,
      updatedCourse,
      {
        new: true,
        useFindAndModify: false
      }
    )

  if (!returnedCourse) {
    return response.status(404).send({ error: 'course not found' })
  } else {
    return response.status(204).json(returnedCourse)
  }
})


coursesRouter.delete('/:id', async (request, response) => {
  // const returnedCourse = await Course
  //   .findById(request.params.id)
  await Course.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

module.exports = coursesRouter