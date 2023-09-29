
const formEl = document.querySelector("#task-form");
const ulEl = document.getElementById("task-list");

const taskFormHandler = (event) => {
    event.preventDefault();
    // check if input values are empty strings

    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    // DOM element interface has the reset() method, which is designed specifically for the <form> element and won't work on any other element.
    formEl.reset();
      // package up data as an object
  const taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
}


const createTaskEl  = (taskDataObj) => {
    // create list item
    const listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // create div to hold task info and add to list item
    const taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3><span class='task-type'>${taskDataObj.type}</span>`;

    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    ulEl.appendChild(listItemEl);
}





formEl.addEventListener('submit', taskFormHandler);