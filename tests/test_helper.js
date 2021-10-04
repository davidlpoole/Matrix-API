const Course = require('../models/course')

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

const nonExistingId = async () => {
  const course = new Course({
    name: 'Animal Welfare 4',
    category: 'Annual Refresher',
    provider: 'Internal',
    duration: '30',
    expiry: '365',
    dateAdded: `${Date.now()}`,
    dateUpdated: `${Date.now()}`
  })
  await course.save()
  await course.remove()

  return course._id.toString()
}

const coursesInDb = async () => {
  return courses = await Course.find({})
}

module.exports = {
  initialCourses, nonExistingId, coursesInDb
}