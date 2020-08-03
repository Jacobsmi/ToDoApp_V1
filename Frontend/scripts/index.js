window.onload = async function(callback) {
    // Calls the function that makes a get to the API to load all the current tasks
    var response = await getAllTasks();

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
};


// Async function to get the full list of tasks from API
async function getAllTasks() {
    // Executes a GET fetch to the API and awaits it to store results in response
    const response = await fetch('http://127.0.0.1:5000/alltasks');
    // Parses the body json into an array
    responseJSON = await response.json();
    // Returns the array
    return responseJSON;
}


// Displays all tasks in a table by looping through each element received in the response
async function displayTasks(response) {
    taskHTML = `<table id="task-list-table">
    <tr>
        <th>Completed</th><th>Task Number</th><th>Task Name</th><th>Delete</th>
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
        taskHTML += `<td>${element[0]}</td><td>${element[1]}</td>
        <td> <button type="button" class="delete-button" id="delete-${element[0]}">Delete</button></td></tr>`

    });
    taskHTML += '</table>';

    // Sets the HTML for the task-list div equal to the HTML for all the items
    document.querySelector("#task-list").innerHTML = taskHTML;
    // Adds eventlistener to all completed checkboxes and 
    // calls the checkBox click handler when any of the checkBoxes are clicked
    document.querySelectorAll(".completed-check").forEach(element => {
        element.addEventListener("click", function() {
            completedClick(element);
        });
    });
    // Adds eventlistener to all delete buttons and 
    // calls the delete button click handler when any of the delete buttons are clicked
    document.querySelectorAll(".delete-button").forEach(element => {
        element.addEventListener("click", deleteClick);
    });

}


//
async function completedClick(element) {
    var completed;
    if (element.checked) {
        console.log("Task num " + element.id + " completed");
        completed = 1;
    } else {
        console.log("Task num " + element.id + " not completed");
        completed = 0;
    }
    await updateCompletion(parseInt(element.id), completed)
}


async function updateCompletion(id, completed) {
    const data = {
        'id': id,
        'completed': completed,
    }
    await fetch('http://127.0.0.1:5000/completetask', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
// Handles the delete button clicks
async function deleteClick() {
    buttonIDNum = this.id.split("-")[1];
    await fetch('http://127.0.0.1:5000/deleteTask', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': buttonIDNum,
        })
    });
    location.reload();
}


// Calls create task whenever someone clicks the button
document.querySelector("#submit-task-form").addEventListener("click", createTask);
// Calls create task if you press enter when typing in a task
document.querySelector("#task-name").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        createTask();
    }
})

// Create an async function(allows for await in function)
async function createTask() {
    const data = {
        'name': document.querySelector("#task-name").value,
    }
    await fetch('http://127.0.0.1:5000/createtask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    location.reload();
}


// Controls what happens when the add button on the bottom of the screen is pushed
function imageClick() {
    const classes = document.querySelector("#cancel-task-button").classList["value"];
    if (classes.includes("d-none")) {
        /*
        If more elements are added then this could be used
        
        
        addElements = document.querySelectorAll(".add-element");
        addElements.forEach(function(element){
            element.classList.remove("d-none");
        });
        displayElements = document.querySelectorAll(".display-element");
        displayElements.forEach(function(element){
            element.classList.add("d-none");
        });
        */
        document.querySelector("#cancel-task-button").classList.remove("d-none");
        document.querySelector("#add-task-button").classList.add("d-none");
        document.querySelector("#task-form").classList.remove("d-none");
        document.querySelector("#task-list").classList.add("d-none");
    } else {
        document.querySelector("#cancel-task-button").classList.add("d-none");
        document.querySelector("#add-task-button").classList.remove("d-none");
        document.querySelector("#task-form").classList.add("d-none");
        document.querySelector("#task-list").classList.remove("d-none");
    }
}