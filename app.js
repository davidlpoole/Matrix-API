const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


const coursesRouter = require('./controllers/courses')
const peopleRouter = require('./controllers/people')
const recordsRouter = require('./controllers/records')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(
  config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/courses', coursesRouter)
app.use('/api/people', peopleRouter)
app.use('/api/records', recordsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app