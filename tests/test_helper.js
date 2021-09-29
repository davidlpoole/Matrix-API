const Course = require('../models/course')

const initialCourses = [
  {
    "name": "Animal Welfare 1",
    "category": "Annual Refresher",
    "provider": "Internal 1",
    "duration": "30",
    "expiry": "365",
    "dateAdded": `${Date.now()}`,
    "dateUpdated": `${Date.now()}`
  },
  {
    "name": "Animal Welfare 1",
    "category": "Annual Refresher",
    "provider": "Internal",
    "duration": "30",
    "expiry": "365",
    "dateAdded": `${Date.now()}`,
    "dateUpdated": `${Date.now()}`
  }
]

const nonExistingId = async () => {
  const course = new Course({
    "name": "Animal Welfare 4",
    "category": "Annual Refresher",
    "provider": "Internal",
    "duration": "30",
    "expiry": "365",
    "dateAdded": `${Date.now()}`,
    "dateUpdated": `${Date.now()}`
  })
  await course.save()
  await course.remove()

  return note._id.toString()
}

const coursesInDb = async () => {
  const courses = await Course.find({})
  return courses.map(course => course.toJSON())
}

module.exports = {
  initialCourses, nonExistingId, coursesInDb
}