const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  // params:
  //  name
  //  username (> 3 chars) (also unique which is defined in model)
  //  password (> 3 chars)

  const body = request.body

  if (body.username.length < 3 | body.password.length < 3) {
    return response.status(400).json({ error: 'username/password do not meet minimum length requirements' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
  response.json(users)
})

module.exports = usersRouter