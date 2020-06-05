
const createNewTask = async () => {
    const response = await fetch('./api/v1/tasks', {
        method: 'POST',
        body: JSON.stringify( { description: document.getElementById("task_description").value }),
        headers: { 'Content-Type': 'application/json' }
    });
    const myJson = await response.json(); //extract JSON from the http response
    location.reload();
}

const completeTask = async (index) => {
    const response = await fetch('./api/v1/tasks/'+index+"/toggle", {
        method: 'POST'
    });
    const myJson = await response.json(); //extract JSON from the http response
    location.reload();
}

const deleteTask = async (index) => {
    const response = await fetch('./api/v1/tasks/'+index, {
        method: 'DELETE',
        body: JSON.stringify( { id: index }),
        headers: {'Content-Type': 'application/json'}
    });
    const myJson = await response.json(); //extract JSON from the http response
    location.reload();
}
