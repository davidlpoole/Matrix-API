# Health and Safety - Employee Training Matrix/Log - Backend/API

## Person: (Employee/Staff?) 

- Name, 
- Email/phone?
- Start date
- Status (or end date to work out whether current employee or not)
- Site, dept, position, shift = (dropdown lists in the front end) matches to unique ID of a 'position'

## Position:

- Site, 
- Dept, 
- Position, 
- Shift, 
- Manager/supervisor,
- Status (e.g. active or discontinued position)

## Course:

- Name
- Category (General induction, annual refresher, halal, etc)
- Provider
- Frequency (Calculate expiry date or no expiry)
- Duration (how long does the course take to complete)

## Matrix: match up the positions to the courses those employees need to do

- Course ID
- Position ID
- Status? or status is based on course/position statuses

## Records:

- Person ID
- Course ID
- Date completed
- Date added to database
- User who added record to database

## Users:

- Name
- Email
- Password (hash)
- Permissions? (could restrict by site, and/or manager of person?)