const Course = require('../models/course')
const Person = require('../models/person')
const Record = require('../models/record')

const initialCourses = [
  {
    name: 'Animal Welfare',
    category: 'Annual Refresher',
    provider: 'Internal',
    duration: '30',
    expiry: '365',
    dateAdded: `${Date.now()}`,
    dateUpdated: `${Date.now()}`
  },
  {
    name: 'General Induction',
    category: 'General',
    provider: 'Internal',
    duration: '30',
    expiry: '36500',
    dateAdded: `${Date.now()}`,
    dateUpdated: `${Date.now()}`
  }
]

const coursesInDb = async () => {
  return courses = await Course.find({})
}

const initialPeople = [
  {
    name: 'David Poole',
    position: 'Deboner',
    department: 'Production',
    shift: 'Night',
    site: 'MTW',
    dateAdded: `${Date.now()}`,
    dateUpdated: `${Date.now()}`
  },
  {
    name: 'James',
    position: 'Forklift driver',
    department: 'DC',
    shift: 'Night',
    site: 'MTW',
    dateAdded: `${Date.now()}`,
    dateUpdated: `${Date.now()}`
  },
]

const peopleInDb = async () => {
  return people = await Person.find({})
}

const recordsInDb = async () => {
  return records = await Record.find({})
}

module.exports = {
  initialCourses, coursesInDb,
  initialPeople, peopleInDb,
  recordsInDb
}