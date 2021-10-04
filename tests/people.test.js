const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Person = require('../models/person')

beforeEach(async () => {
  await Person.deleteMany({})

  let personObject = new Person(helper.initialPeople[0])
  await personObject.save()

  personObject2 = new Person(helper.initialPeople[1])
  await personObject2.save()
})

describe('GET', () => {
  test('all people are returned (as json)', async () => {
    const response = await api
      .get('/api/people')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialPeople.length)
  })

  test('a specific person is returned (as json)', async () => {
    const peopleAtStart = await helper.peopleInDb()
    const personToView = peopleAtStart[0]

    await api
      .get(`/api/people/${personToView._id}`)
      .expect(200)

    const response = await api
      .get('/api/people')
    expect(response.body).toHaveLength(helper.initialPeople.length)

    const name = response.body.map(r => r.name)
    expect(name).toContain(personToView.name)

  })

  test('a valid but non-existent person id is handled (error 404)', async () => {
    const response = await api
      .get('/api/people/6153d33c420e903eb289f0ca')
      .expect(404)
  })

  test('an invalid person id is handled (error 400)', async () => {
    const response = await api
      .get('/api/people/111')
      .expect(400)
  })
})

describe('POST', () => {
  test('a new person can be added', async () => {

    const person = {
      name: 'Brian',
      position: 'Deboner',
      department: 'Production',
      shift: 'Night',
      site: 'MTW',
    }

    await api
      .post('/api/people')
      .send(person)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/people')

    const name = response.body.map(r => r.name)

    expect(response.body).toHaveLength(helper.initialPeople.length + 1)
    expect(name).toContain(person.name)
  })


  test('error if missing required fields', async () => {

    const personWithMissingName = {
      name: '',
      position: 'Deboner',
      department: 'Production',
      shift: 'Night',
      site: 'MTW',
    }
    const personWithMissingPosition = {
      name: 'Second Person',
      position: '',
      department: 'Production',
      shift: 'Night',
      site: 'MTW',
    }
    const personWithMissingDepartment = {
      name: 'Third Person',
      position: 'A Position',
      department: '',
      shift: 'Night',
      site: 'MTW',
    }
    const personWithMissingSite = {
      name: 'Fourth Person',
      position: 'A Position',
      department: 'Production',
      shift: 'Night',
      site: '',
    }

    await api
      .post('/api/people')
      .send(personWithMissingName)
      .expect(400)

    await api
      .post('/api/people')
      .send(personWithMissingPosition)
      .expect(400)

    await api
      .post('/api/people')
      .send(personWithMissingDepartment)
      .expect(400)

    await api
      .post('/api/people')
      .send(personWithMissingSite)
      .expect(400)

    const getResponse = await api
      .get('/api/people')
    expect(getResponse.body).toHaveLength(helper.initialPeople.length)
  })

  test('duplicate (person name) cannot be added', async () => {

    const personWithDuplicateName = {
      name: 'David Poole',
      position: 'Deboner',
      department: 'Production',
      shift: 'Night',
      site: 'MTW',
    }

    await api
      .post('/api/people')
      .send(personWithDuplicateName)
      .expect(400)

    const getResponse = await api
      .get('/api/people')
    expect(getResponse.body).toHaveLength(helper.initialPeople.length)

  })
})

describe('PUT', () => {
  test('an existing person can be modified', async () => {

    const peopleAtStart = await helper.peopleInDb()
    const personToUpdate = peopleAtStart[0]

    const updatedPerson = {
      name: 'David Eloop',
      position: 'Deboner',
      department: 'Production',
      shift: 'Night',
      site: 'MTW',
    }

    await api
      .put(`/api/people/${personToUpdate._id}`)
      .send(updatedPerson)
      .expect(204)

    const response = await api
      .get('/api/people')
    expect(response.body).toHaveLength(helper.initialPeople.length)

    const name = response.body.map(r => r.name)
    expect(name).toContain(updatedPerson.name)
    expect(name).not.toContain(personToUpdate.name)
  })

})

describe('DELETE', () => {
  test('an existing person can be deleted', async () => {
    const peopleAtStart = await helper.peopleInDb()
    const personToDelete = peopleAtStart[1]

    await api
      .delete(`/api/people/${personToDelete._id}`)
      .expect(204)

    const response = await api
      .get('/api/people')
    expect(response.body).toHaveLength(helper.initialPeople.length - 1)

    const name = response.body.map(r => r.name)
    expect(name).not.toContain(personToDelete.name)
  })
})

afterAll(() => {
  mongoose.connection.close()
})