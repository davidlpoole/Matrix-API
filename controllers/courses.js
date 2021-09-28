const coursesRouter = require('express').Router()
const Course = require('../models/course')
// const User = require('../models/user')

coursesRouter.get('/', async (request, response) => {
  const courses = await Course
    .find({})
  // .populate('user', { username: 1, name: 1 })
  response.json(courses)
})

coursesRouter.get('/:id', async (request, response) => {
  const returnedCourse = await Course
    .findById(request.params.id)
  // .populate('user', { username: 1, name: 1 })
  response.json(returnedCourse)
})

coursesRouter.post('/', async (request, response) => {
  const body = request.body

  // if (!request.token) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  // const user = await User.findById(request.user.id)

  const course = new Course({
    name: body.name,
    category: body.category,
    provider: body.provider,
    expiry: body.expiry || null,
    duration: body.duration,
    dateAdded: Date.now,
    dateUpdated: Date.now
  })

  if (!course.name) {
    response.status(400).end()
  } else {
    const addedCourse = await course.save()

    // user.courses = user.courses.concat(addedCourse._id)
    // await user.save()

    response.status(201).json(addedCourse)
  }
})

coursesRouter.put('/:id', async (request, response) => {
  const body = request.body
  // if (!request.token) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  const courseToUpdate = await Course
    .findById(request.params.id)
  // .populate('user', { username: 1 })
  // if (request.user.username.toString() === courseToUpdate.user.username) {
  const updatedCourse = {
    name: body.name,
    category: body.category,
    provider: body.provider,
    expiry: body.expiry || null,
    duration: body.duration,
    dateUpdated: Date.now()
  }
  const returnedCourse = await Course.findByIdAndUpdate(request.params.id, updatedCourse, { new: true })
  response.json(returnedCourse)
  // } else {
  // return response.status(401).json({ error: 'Unauthorized' })
  //
})

coursesRouter.delete('/:id', async (request, response) => {
  const returnedCourse = await Course
    .findById(request.params.id)
  // .populate('user', { username: 1 })

  // if (!request.token) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // } else if (request.user.username.toString() === returnedCourse.user.username) {
  await Course.findByIdAndRemove(request.params.id)
  return response.status(204).end()
  // } else {
  //   return response.status(401).json({ error: 'Unauthorized' })
  // }
})

module.exports = coursesRouter