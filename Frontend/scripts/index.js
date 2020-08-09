window.addEventListener('load', async function() {
    setupList();
});


const setupList = async() => {
    // Calls the function that makes a get to the API to load all the current tasks
    let response = await getAllTasks();
    // API error handling
    if (response['error'] != undefined) {
        alert("Error connecting to the DB. Please refresh");
    }
    // Checks if the list is empty
    else if (response.length === 0) {
        // Displays message on empty task list
        document.querySelector("#task-empty").innerHTML = `<h3>No tasks in database</h3><br>
        <h4>Please add a task by clicking the plus in the bottom left corner</h4>`;
    } else {
        document.querySelector("#task-empty").innerHTML = "";
        // Calls function that parses all tasks and displays them
        displayTasks(response);
    }
}


// Async function to get the full list of tasks from API
const getAllTasks = async() => {
    // Executes a GET fetch to the API and awaits it to store results in response
    const response = await fetch('http://127.0.0.1:5000/alltasks');
    // Parses the body json into an array
    responseJSON = await response.json();
    // Returns the array
    return responseJSON;
}


// Displays all tasks in a table by looping through each element received in the response
const displayTasks = async(response) => {
    /*
    element array:
    [0] => Task ID
    [1] => Task Name
    [2] => Completed Status(0 for not completed, 1 for completed)
    [3] => Due Date string
    */
    // Loops through each element received in the response
    uncompletedTaskHTML = "";
    completedTaskHTML = "";
    response.forEach(element => {
        due_str = processDate(element[3]);
        if (element[2] == 0) {
            // Creates a string for it the element with its information
            uncompletedTaskHTML += `<div class="task-card" id="${element[0]}">`;
            uncompletedTaskHTML += `<h4 class="card-title">Task Name: ${element[1]}</h4>`
            uncompletedTaskHTML += `<h4 class="card-due-date">${due_str}</h4>`
            uncompletedTaskHTML += `<h4 class="card-status">Status: In Progress</h4>`
            uncompletedTaskHTML += `<button type="button" class="complete-button" id="${element[2]}-${element[0]}">Complete</button>
        <button type="button" class="delete-button" id="delete-${element[0]}">Delete</button></div>`
        } else if (element[2] == 1) {
            completedTaskHTML += `<div class="task-card" id="${element[0]}">`;
            completedTaskHTML += `<h4 class="card-title">Task Name: ${element[1]}</h4>`
            completedTaskHTML += `<h4 class="card-due-date">${due_str}</h4>`
            completedTaskHTML += `<h4 class="card-status">Status: Completed!</h4>`
            completedTaskHTML += `<button type="button" class="complete-button" id="${element[2]}-${element[0]}">Uncomplete</button>
        <button type="button" class="delete-button" id="delete-${element[0]}">Delete</button></div>`
        }

    });

    // Sets the HTML for the task-list div equal to the HTML for all the items
    document.querySelector("#uncompleted-task-list").innerHTML = uncompletedTaskHTML;
    // Sets the HTML for the task-list div equal to the HTML for all the items
    document.querySelector("#completed-task-list").innerHTML = completedTaskHTML;

    // Adds eventlistener to all completed checkboxes and 
    // calls the checkBox click handler when any of the checkBoxes are clicked
    document.querySelectorAll(".complete-button").forEach(element => {
        element.addEventListener("click", () => {
            completedClick(element);
        });
    });
    // Adds eventlistener to all delete buttons and 
    // calls the delete button click handler when any of the delete buttons are clicked
    document.querySelectorAll(".delete-button").forEach(element => {
        element.addEventListener("click", () => {
            deleteClick(element.id)
        });
    });

}


// Function that takes the dueDate string and determines how far away the due date is from the current day
// depending on how far the day is determines what displays on the task card
const processDate = dueDate => {
    // Turn dueDate string into individual parts
    let dateParts = dueDate.split("-");
    // Create dueDate as a new Date object
    let dDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
    // Create a Date object with the current time
    let currentDate = new Date();
    // Find the difference in milliseconds turn that into seconds and then days
    // Then turn that into an int and round up
    let differnce = dDate.getTime() - currentDate.getTime();
    let diffDays = parseInt((differnce / (1000)) / 86400) + 1
        // If the due date is today
    if (diffDays == 0) {
        return "DUE TODAY";
    }
    // If the due date has passed 
    else if (diffDays < 0) {
        return "OVERDUE";
    }
    // If the due date is less than 7 days away
    else if (diffDays > 0 && diffDays < 8) {
        return (`Due Date: ${dueDate}<br>!!!Only ${diffDays} days left!!!`);
    }
    // If the due date is more than 7 days away
    return `Due Date: ${dueDate}`;
}



//
const completedClick = async(element) => {
    //  Parse the rowID and completed num
    elemParts = element.id.split("-");
    // Find the right new value for completed
    let completed = 0;
    if (elemParts[0] == 0) {
        completed = 1;
    }
    // Set new completed value in DB
    await updateCompletion(parseInt(elemParts[1]), completed);
    // Redraw the elements without reloading the page
    setupList();
}


const updateCompletion = async(id, completed) => {
    const data = {
        'id': id,
        'completed': completed,
    }
    const response = await fetch('http://127.0.0.1:5000/completetask', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    respJSON = await response.json();
    if (respJSON['error'] != undefined) {
        alert("Error completing task to the DB");
        location.reload();
    }
}

// Handles the delete button clicks
const deleteClick = async(id) => {
    buttonIDNum = id.split("-")[1];
    const response = await fetch('http://127.0.0.1:5000/deleteTask', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': buttonIDNum,
        })
    });
    respJSON = await response.json();
    if (respJSON['error'] != undefined) {
        alert("Error adding task to the DB");
    }
    location.reload();
}


// Create an async function(allows for await in function)
const createTask = async() => {
    taskName = document.querySelector("#task-name").value;
    taskDue = document.querySelector("#task-due").value;
    dueParts = taskDue.split("-");
    taskDue = dueParts[1] + '-' + dueParts[2] + '-' + dueParts[0];
    const data = {
        'name': taskName,
        'due': taskDue,
    }
    if (taskName.length === 0) {
        alert("Task Name cannot be blank");
        return;
    }
    const response = await fetch('http://127.0.0.1:5000/createtask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    respJSON = await response.json();
    if (respJSON['error'] != undefined) {
        alert("Error adding task to the DB");
    }
    location.reload();
}

const setupForm = () => {
    // Focuses on the input field
    document.querySelector("#task-name").focus();
    // Create a date object so we can set the value min and max for the date field
    let currentTime = new Date();
    // Create dateInfo object that holds all the data from the Date() object
    dateInfo = {
        year: String(currentTime.getFullYear()),
        month: String(currentTime.getMonth() + 1).padStart(2, '0'),
        day: String(currentTime.getDate()).padStart(2, '0'),
        futureYear: String(currentTime.getFullYear() + 5)
    };
    // Create a today string
    const today = dateInfo.year + '-' + dateInfo.month + '-' + dateInfo.day;
    // Create a future string
    const future = dateInfo.futureYear + '-' + dateInfo.month + '-' + dateInfo.day;
    // Set the value of the Due date
    document.querySelector("#task-due").value = today;
    // Set the value of min to toady
    // Task can not be due in the past
    document.querySelector("#task-due").min = today;
    // Set the due date to 5 years in the future
    document.querySelector("#task-due").max = future;
}

// Controls what happens when the add button on the bottom of the screen is pushed
const imageClick = () => {
    const classes = document.querySelector("#task-button").classList["value"];
    // SWITCHING TO ADD TASK PAGE
    if (!classes.includes("rotated")) {
        // SET + to x
        document.querySelector("#task-button").classList.add("rotated");
        // Calls the function that setups the form with proper values
        setupForm();

        document.querySelectorAll(".first-page").forEach(element=>{
            if (element.classList["value"].includes("list")){
                element.classList.remove("list");
            }
            element.classList.add("d-none");
        });
        // Showing new elements
        document.querySelectorAll(".second-page").forEach(element=>{
            if (element.id === "task-form"){
                element.classList.add("center-block")
            }
            element.classList.remove("d-none");
        });
    }
    // SWITCHING TO HOMEPAGE 
    else {
        document.querySelector("#task-button").classList.remove("rotated");
        document.querySelectorAll(".first-page").forEach(element=>{
            if (element.id.includes("list")){
                element.classList.add("list");
            }
            element.classList.remove("d-none");
        });
        document.querySelectorAll(".second-page").forEach(element=>{
            if (element.id.includes("form")){
                element.classList.remove("center-block");
            }
            element.classList.add("d-none");
        });
    }
}



// Add eventListeners for submitting a new task

// Calls create task whenever someone clicks the button
document.querySelector("#submit-task-form").addEventListener("click", createTask);
// Calls create task if you press enter when typing in a task
document.querySelector("#task-name").addEventListener("keyup", event => {
    if (event.keyCode === 13) {
        createTask();
    }
})