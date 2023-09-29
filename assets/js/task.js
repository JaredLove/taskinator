const buttonEl = document.getElementById("save-task");
const ulEl = document.getElementById("task-list");


const addTask = () => {
    const liEl = document.createElement("li");
    liEl.className = "task-item";
    liEl.textContent = `A task is going to be added soon!`;
    ulEl.appendChild(liEl);
}







buttonEl.addEventListener('click', addTask);