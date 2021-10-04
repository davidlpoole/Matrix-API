const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Course = require('../models/course')

beforeEach(async () => {
  await Course.deleteMany({})

  let courseObject = new Course(helper.initialCourses[0])
  await courseObject.save()

  courseObject2 = new Course(helper.initialCourses[1])
  await courseObject2.save()
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
    const coursesAtStart = await helper.coursesInDb()
    const courseToView = coursesAtStart[0]

    await api
      .get(`/api/courses/${courseToView._id}`)
      .expect(200)

    const response = await api
      .get('/api/courses')
    expect(response.body).toHaveLength(helper.initialCourses.length)

    const name = response.body.map(r => r.name)
    expect(name).toContain(courseToView.name)

  })

  test('a valid but non-existent course id is handled (error 404)', async () => {
    const response = await api
      .get('/api/courses/6153d33c420e903eb289f0ca')
      .expect(404)
  })

  test('an invalid course id is handled (error 400)', async () => {
    const response = await api
      .get('/api/courses/111')
      .expect(400)
  })
})

describe('POST', () => {
  test('a new course can be added', async () => {

    const course = {
      name: 'sksjnksjn',
      category: 'Annual Refresher',
      provider: 'Internal',
      duration: '30',
      expiry: '365'
    }

    await api
      .post('/api/courses')
      .send(course)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/courses')

    const name = response.body.map(r => r.name)

    expect(response.body).toHaveLength(helper.initialCourses.length + 1)
    expect(name).toContain(course.name)
  })


  test('error if missing required fields', async () => {

    const courseWithMissingName = {
      name: '',
      category: 'Annual Refresher',
      provider: 'Internal',
      duration: '30',
      expiry: '365'
    }
    const courseWithMissingCategory = {
      name: 'A Second Course',
      category: '',
      provider: 'Internal',
      duration: '30',
      expiry: '365'
    }
    const courseWithMissingProvider = {
      name: 'A Third Course',
      category: 'Annual Refresher',
      provider: '',
      duration: '30',
      expiry: '365'
    }

    await api
      .post('/api/courses')
      .send(courseWithMissingName)
      .expect(400)

    await api
      .post('/api/courses')
      .send(courseWithMissingCategory)
      .expect(400)

    await api
      .post('/api/courses')
      .send(courseWithMissingProvider)
      .expect(400)

    const getResponse = await api
      .get('/api/courses')
    expect(getResponse.body).toHaveLength(helper.initialCourses.length)
  })

  test('duplicate (course name) cannot be added', async () => {

    const courseWithDuplicateName = {
      name: 'Animal Welfare',
      category: 'Annual Refresher',
      provider: 'Internal',
      duration: '30',
      expiry: '365'
    }

    await api
      .post('/api/courses')
      .send(courseWithDuplicateName)
      .expect(400)

    const getResponse = await api
      .get('/api/courses')
    expect(getResponse.body).toHaveLength(helper.initialCourses.length)

  })
})

describe('PUT', () => {
  test('an existing course can be modified', async () => {

    const coursesAtStart = await helper.coursesInDb()
    const courseToUpdate = coursesAtStart[0]

    const updatedCourse = {
      name: 'updated course',
      category: 'Annual Refresher',
      provider: 'Internal',
      duration: '30',
      expiry: '365'
    }

    await api
      .put(`/api/courses/${courseToUpdate._id}`)
      .send(updatedCourse)
      .expect(204)

    const response = await api
      .get('/api/courses')
    expect(response.body).toHaveLength(helper.initialCourses.length)

    const name = response.body.map(r => r.name)
    expect(name).toContain(updatedCourse.name)
    expect(name).not.toContain(courseToUpdate.name)
  })

})

describe('DELETE', () => {
  test('an existing course can be deleted', async () => {
    const coursesAtStart = await helper.coursesInDb()
    const courseToDelete = coursesAtStart[1]

    await api
      .delete(`/api/courses/${courseToDelete._id}`)
      .expect(204)

    const response = await api
      .get('/api/courses')
    expect(response.body).toHaveLength(helper.initialCourses.length - 1)

    const name = response.body.map(r => r.name)
    expect(name).not.toContain(courseToDelete.name)
  })
})

afterAll(() => {
  mongoose.connection.close()
})