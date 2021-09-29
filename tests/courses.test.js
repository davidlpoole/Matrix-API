const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Course = require('../models/course')

let aCourseId = null

beforeEach(async () => {
  await Course.deleteMany({})

  let courseObject = new Course(helper.initialCourses[0])
  const response = await courseObject.save()
  aCourseId = response._id

  courseObject = new Course(helper.initialCourses[1])
  await courseObject.save()
})

describe('GET', () => {
  test('all courses are returned (as json)', async () => {
    const response = await api
      .get('/api/courses')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialCourses.length)
  })

  test('a specific course is returned (as json)', async () => {
    const response = await api
      .get('/api/courses/' + aCourseId)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.name).toEqual(helper.initialCourses[0].name)

  })

  test('a valid but non-existent course id is handled (error 404)', async () => {
    const response = await api
      .get('/api/courses/6153d33c420e903eb289f0ca')
      .expect(404)
  }, 10000)

  test('an invalid course id is handled (error 400)', async () => {
    const response = await api
      .get('/api/courses/111')
      .expect(400)
  }, 10000)
})

describe('POST', () => {
  test('a new course can be added', async () => {
  })
  test('mutiple courses can be added', async () => {
  })
  test('error if missing required fields', async () => {
  })
  test('duplicate (course name) cannot be added', async () => {
  })
})

describe('PUT', () => {
  test('an existing course can be modified', async () => {
  })
  test('invalid ID is handled', async () => {
  })
  test('valid but non existent ID is handled', async () => {
  })
})

describe('DELETE', () => {
  test('an existing course can be deleted', async () => {
  })
  test('invalid ID is handled', async () => {
  })
  test('valid but non existent ID is handled', async () => {
  })
})

afterAll(() => {
  mongoose.connection.close()
})