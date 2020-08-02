// Calls the load function when the window loads
window.onload = async function () {
    // Calls the function that makes a get to the API to load all the current tasks
    var response = await getAllTasks();
    // Calls function that parses all tasks and displays them
    displayTasks(response);
};


// Async function to get the full list of tasks from API
async function getAllTasks() {
    // Executes a GET fetch to the API and awaits it to store results in response
    const response = await fetch('http://127.0.0.1:5000/alltasks')
    // Parses the body json into an array
    responseJSON = await response.json()
    // Returns the array
    return responseJSON
}


// Displays all tasks by looping through each element received in the response
async function displayTasks(response) {
    taskHTML = "";
    // Loops through each element received in the response
    response.forEach(element => {
        // Creates a string for it the element with its information
        taskHTML += `Task Number: ${element[0]} Task Name: ${element[1]}<button type="button" class="delete-button" id="delete-${element[0]}">Delete</button><br>`

    });
    // Sets the HTML for the task-list div equal to the HTML for all the items
    document.querySelector("#task-list").innerHTML = taskHTML;
    // Calls the delete button click handler when any of the delete buttons are clicked
    document.querySelectorAll(".delete-button").forEach(element => {
        element.addEventListener("click", deleteClick);
    });

}


// Handles the delete button clicks
async function deleteClick(){
    buttonIDNum = this.id.split("-")[1];
    await fetch('http://127.0.0.1:5000/deleteTask', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id':buttonIDNum,
        })
    });
    location.reload();
}


// Calls create task whenever someone clicks the button
document.querySelector("#submit-task-form").addEventListener("click", createTask);


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