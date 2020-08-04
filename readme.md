# To-Do List Web App

## Currently Working on

- Add a date to the task section/Better add task function

## To Do

- When plus is hit autofocus onto add task
- Add status codes to API responses for bad input(400) 
- Create a Taskbar

## Completed

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
