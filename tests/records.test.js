const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Course = require('../models/course')
const Person = require('../models/person')
const Record = require('../models/record')

let initialRecords
let courseObject1
let courseObject2
let personObject1
let personObject2

beforeEach(async () => {

  await Course.deleteMany({})
  await Person.deleteMany({})
  await Record.deleteMany({})

  courseObject1 = new Course(helper.initialCourses[0])
  await courseObject1.save()

  courseObject2 = new Course(helper.initialCourses[1])
  await courseObject2.save()

  personObject1 = new Person(helper.initialPeople[0])
  await personObject1.save()

  personObject2 = new Person(helper.initialPeople[1])
  await personObject2.save()

  initialRecords = [
    {
      person: personObject1.id,
      course: courseObject1.id,
      dateCompleted: '2021-10-04',
      dateAdded: `${Date.now()}`,
      dateUpdated: `${Date.now()}`
    },
    {
      person: personObject2.id,
      course: courseObject2.id,
      dateCompleted: '2021-10-03',
      dateAdded: `${Date.now()}`,
      dateUpdated: `${Date.now()}`
    },
  ]

  let recordObject1 = new Record(initialRecords[0])
  await recordObject1.save()

  let recordObject2 = new Record(initialRecords[1])
  await recordObject2.save()
})

describe('GET', () => {
  test('all records are returned (as json)', async () => {
    const response = await api
      .get('/api/records')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialRecords.length)
  })

  test('a specific record is returned (as json)', async () => {
    const recordsAtStart = await helper.recordsInDb()
    const recordToView = recordsAtStart[0]

    await api
      .get(`/api/records/${recordToView._id}`)
      .expect(200)

    const response = await api
      .get('/api/records')
    expect(response.body).toHaveLength(initialRecords.length)

    const name = response.body.map(r => r.name)
    expect(name).toContain(recordToView.name)

  })

  test('a valid but non-existent record id is handled (error 404)', async () => {
    const response = await api
      .get('/api/records/6153d33c420e903eb289f0ca')
      .expect(404)
  })

  test('an invalid record id is handled (error 400)', async () => {
    const response = await api
      .get('/api/records/111')
      .expect(400)
  })
})

describe('POST', () => {
  test('a new record can be added', async () => {

    const record = {
      person: personObject1.id,
      course: courseObject2.id,
      dateCompleted: '2021-10-01',
      dateAdded: `${Date.now()}`,
      dateUpdated: `${Date.now()}`
    }

    await api
      .post('/api/records')
      .send(record)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/records')

    const dateCompleted = response.body.map(r => r.dateCompleted)

    expect(response.body).toHaveLength(initialRecords.length + 1)
    expect(dateCompleted).toContain(record.dateCompleted)
  })


  test('error if missing required fields', async () => {

    const recordWithMissingPerson = {
      person: '',
      course: courseObject1.id,
      dateCompleted: '2021-10-05',
    }
    const recordWithMissingCourse = {
      person: personObject2.id,
      course: '',
      dateCompleted: '2021-10-05',
    }
    const recordWithMissingDateCompleted = {
      person: personObject2.id,
      course: courseObject1.id,
      dateCompleted: '',
    }

    await api
      .post('/api/records')
      .send(recordWithMissingPerson)
      .expect(400)

    await api
      .post('/api/records')
      .send(recordWithMissingCourse)
      .expect(400)

    await api
      .post('/api/records')
      .send(recordWithMissingDateCompleted)
      .expect(400)

    const getResponse = await api
      .get('/api/records')
    expect(getResponse.body).toHaveLength(initialRecords.length)
  })
})

describe('PUT', () => {
  test('an existing record can be modified', async () => {

    const recordsAtStart = await helper.recordsInDb()
    const recordToUpdate = recordsAtStart[0]

    const updatedRecord = {
      person: personObject2.id,
      course: courseObject1.id,
      dateCompleted: '2021-10-01'
    }

    await api
      .put(`/api/records/${recordToUpdate._id}`)
      .send(updatedRecord)
      .expect(200)

    const response = await api
      .get('/api/records')
    expect(response.body).toHaveLength(initialRecords.length)

    const dateCompleted = response.body.map(r => r.dateCompleted)
    expect(dateCompleted).toContain(updatedRecord.dateCompleted)
    expect(dateCompleted).not.toContain(recordToUpdate.dateCompleted)
  })

})

describe('DELETE', () => {
  test('an existing record can be deleted', async () => {
    const recordsAtStart = await helper.recordsInDb()
    const recordToDelete = recordsAtStart[1]

    await api
      .delete(`/api/records/${recordToDelete._id}`)
      .expect(204)

    const response = await api
      .get('/api/records')
    expect(response.body).toHaveLength(initialRecords.length - 1)

  })
})

afterAll(() => {
  mongoose.connection.close()
})