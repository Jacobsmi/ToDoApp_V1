document.querySelector("#submit-task-form").addEventListener("click", createTask);

function createTask() {
    const taskName = document.querySelector("#task-name").value;
    fetch('http://127.0.0.1:5000/createtask', {
        method: 'post',
        body: JSON.stringify({
            'name' : taskName,
        })
    }).then(function(response){
        console.log(response.json())
    });
    //location.reload();
}
