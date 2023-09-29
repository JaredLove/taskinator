

const formEl = document.querySelector("#task-form");
const ulEl = document.getElementById("task-list");
const pageContentEl = document.querySelector("#page-content");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksCompletedEl = document.querySelector("#tasks-completed");

let taskIdCounter = 0;
let tasks = [];
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
    // has data attribute, so get task id and call function to complete edit process
    let isEdit = formEl.hasAttribute("data-task-id");
    if (isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        let taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
        };
    
        createTaskEl(taskDataObj);
    }
}


const createTaskEl  = (taskDataObj) => {
    // create list item
    const listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

      // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    const taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3><span class='task-type'>${taskDataObj.type}</span>`;

    listItemEl.appendChild(taskInfoEl);

    let taskActionsEl = createTaskActions(taskIdCounter, taskDataObj);
    listItemEl.appendChild(taskActionsEl);
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);
    saveTasks();
    // add entire list item to list
    if(taskDataObj.status === "to do"){
        listItemEl.querySelector("select[name='status-change']").selectedIndex
        ulEl.appendChild(listItemEl);
    }else if(taskDataObj.status === "in progress") {
        listItemEl.querySelector("select[name='status-change']").selectedIndex
        tasksInProgressEl.appendChild(listItemEl);
    }else if(taskDataObj.status === "completed"){
        listItemEl.querySelector("select[name='status-change']").selectedIndex
        tasksCompletedEl.appendChild(listItemEl);
    }

    taskIdCounter++
}

const createTaskActions = (taskId, taskDataObj) => {
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    // create edit button
    let editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    let statusSelectEl = document.createElement("select");
    let statusChoices = ["To Do", "In Progress", "Completed"];
    for (let i = 0; i < statusChoices.length; i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        
    // Check if the current option matches the task's status and set it as the default
    if (taskDataObj.status === "in progress" && statusChoices[i] === "In Progress") {
        statusOptionEl.selected = true;
    } else if (taskDataObj.status === "to do" && statusChoices[i] === "To Do") {
        statusOptionEl.selected = true;
    } else if (taskDataObj.status === "completed" && statusChoices[i] === "Completed") {
        statusOptionEl.selected = true;
    }
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
      }
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}

const taskButtonHandler = () => {
    console.log(event.target);
    if (event.target.matches(".delete-btn")) {
        let taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
      }else if(event.target.matches(".edit-btn")){
        let taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
      }
}

const deleteTask = (taskId) => {
    const taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
    taskSelected.remove();

    // create new array to hold updated list of tasks
    const updatedTaskArr = [];

    // loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
    }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks()
}

const editTask = (taskId) => {
    console.log("editing task #" + taskId);

      // get task list item element
    let taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
    // get content from task name and type
    let taskName = taskSelected.querySelector("h3.task-name").textContent;
    // task type
    let taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}
let completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    let taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
        }
    };
    // reset the form by removing the task id and changing the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
    alert("Task Updated!");
  };

  const taskStatusChangeHandler = (event) => {
      // get the task item's id
    let taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    let statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    let taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);

    if (statusValue === "to do") {
        ulEl.appendChild(taskSelected);
      } 
      else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
      } 
      else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
      }

      // update task's in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
        }
    }
    saveTasks();
  };

  const saveTasks = () => {
    // JSON stands for JavaScript Object Notation, which is a means of organizing and structuring data that's transferred from one place to another
    // stringify() implies, we just converted the tasks array into a string for saving in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  const loadTasks = () => {
    let savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        return false;
      }
    // change it back to an array of objects
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (let i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]);
    }
  }


    pageContentEl.addEventListener("change", taskStatusChangeHandler);
    pageContentEl.addEventListener("click", taskButtonHandler);
    formEl.addEventListener('submit', taskFormHandler);

    loadTasks();