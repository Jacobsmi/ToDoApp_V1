window.onload = load;

function load(){
    console.log("PAGE IS LOADED");
}

document.querySelector("#submit-task-form").addEventListener("click", createTask);

// Create an async function(allows for await in function)
async function createTask(){
    const data = {
        'name': document.querySelector("#task-name").value,
    }
    const response = await fetch('http://127.0.0.1:5000/createtask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log(response);
    location.reload();
}