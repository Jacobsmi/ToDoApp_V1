window.addEventListener('load', async function() {
    // Calls the function that makes a get to the API to load all the current tasks
    let response = await getAllTasks();

    if (response['error'] != undefined) {
        alert("Error connecting to the DB. Please refresh");
    }
    // Checks if the list is empty
    else if (response.length === 0) {
        // Displays message on empty task list
        document.querySelector("#task-list").innerHTML = `<h3>No tasks in database</h3><br>
        <h4>Please add a task by clicking the plus in the bottom left corner</h4>`;
    } else {
        // Calls function that parses all tasks and displays them
        displayTasks(response);
    }
});


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
    console.log("RESPONSE");
    console.log(response);
    taskHTML = `<table id="task-list-table">
    <tr>
        <th>Completed</th><th>Task Name</th><th>Due Date</th><th>Delete</th>
    </tr>`;
    // Loops through each element received in the response
    response.forEach(element => {
        // Creates a string for it the element with its information
        taskHTML += '<tr><td>'
        if (element[2] === 0) {
            taskHTML += `<input type="checkbox" class="completed-check" id="${element[0]}"></td>`;
        } else {
            taskHTML += `<input type="checkbox" class="completed-check" id="${element[0]}" checked></td>`;

        }
        taskHTML += `<td>${element[1]}</td><td>${element[3]}</td>
        <td> <button type="button" class="delete-button" id="delete-${element[0]}">Delete</button></td></tr>`

    });
    taskHTML += '</table>';

    // Sets the HTML for the task-list div equal to the HTML for all the items
    document.querySelector("#task-list").innerHTML = taskHTML;
    // Adds eventlistener to all completed checkboxes and 
    // calls the checkBox click handler when any of the checkBoxes are clicked
    document.querySelectorAll(".completed-check").forEach(element => {
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


//
const completedClick = async(element) => {
    let completed;
    if (element.checked) {
        completed = 1;
    } else {
        completed = 0;
    }
    await updateCompletion(parseInt(element.id), completed)
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
        month: String(currentTime.getMonth()).padStart(2, '0'),
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
        // Show the div that holds the form that adds tasks
        document.querySelector("#task-form").classList.remove("d-none");
        setupForm();
        // Hide the list of tasks
        document.querySelector("#task-list").classList.add("d-none");
    }
    // SWITCHING TO HOMEPAGE 
    else {
        // Set x to +
        document.querySelector("#task-button").classList.remove("rotated");
        // Hiding the task form 
        document.querySelector("#task-form").classList.add("d-none");
        // Showing the main task
        document.querySelector("#task-list").classList.remove("d-none");
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