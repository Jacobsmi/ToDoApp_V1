# To-Do List Web App

## Currently Working on

- Add overdue status to cards
- Display Due number of days as well as Date

## To Do

- Deploy API to Heroku or AWS
- Ability to edit current responses
- Add ability to do overdue
- Add sort by function(due date, completed/not completed, submitted etc)
- Add status codes to API responses for bad input(400)
- (Maybe)Create a Taskbar

## Completed

- Style the Task Form Page
- Add grid layout to the task-list section
- Add a date to the task section/Better add task function
- When plus is hit autofocus onto add task
- Add better return JSON from the API for validation client-side
  - Can now detect the difference between good get from db, good get with no data, and bad get
- Adding completed functionality
- Created actions for button
  - Hiding table
  - Showing input
- Created delete buttons for all the tasks
- Can reteive all tasks that have been stored in the database by using a GET fetch and receiving all the tasks from the
backend as JSON parsing them and displaying them
- Can add a task to the database using the by using the frontend to send a POST request to the backend
and the backend storing it in a sqlite3 database
- Being able to test the POST request from the frontend => backend
  - Fixed by using flask_cors and setting CORS options in the app
- Create a basic layout for frontend
- Create a basic layout for backend
