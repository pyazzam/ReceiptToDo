let tasksArray = [];
let tasksToShow = [];
let hideCompleted = false;

document.addEventListener("DOMContentLoaded", function () {
  let tasksCount = document.getElementById("numberOfTasks");
  const overlay = document.getElementById("overlayID");
  const modalBox = document.querySelector(".modal-container");
  const addBtn = document.getElementById("addButton");
  const close = document.getElementById("close");
  const continueBtn = document.getElementById("continueId");
  const totalCount = document.getElementById("totaltotal");
  const hideCompletedBtn = document.getElementById("hideCompleted");
  const deleteBtn = document.getElementById("delete");

  function updateTaskCount() {
    if (hideCompleted) {
      tasksCount.innerHTML = tasksToShow.length;
      totalCount.innerHTML = tasksArray.length;

      document.querySelector(".total").style.display = "none";
      document.querySelector(".total-uncompleted-title").innerHTML = "Total";
    } else {
      let uncompletedCount = 0;
      for (let i = 0; i < tasksArray.length; i++) {
        if (!tasksArray[i].completed) {
          uncompletedCount = uncompletedCount + 1;
        }
      }
      tasksCount.innerHTML = uncompletedCount;
      totalCount.innerHTML = tasksToShow.length;

      document.querySelector(".total").style.display = "flex";
      document.querySelector(".total-uncompleted-title").innerHTML =
        "Total Uncompleted";
    }
  }

  hideCompletedBtn.addEventListener("click", function () {
    hideCompleted = !hideCompleted;
    renderPersonalizedTasks();
    hideCompletedBtn.classList.toggle("toggled", hideCompleted);
    localStorage.setItem("hideCompleted", JSON.stringify(hideCompleted));
  });

  function clearTable() {
    const table = document
      .getElementById("tableID")
      .getElementsByTagName("tbody")[0];
    table.innerHTML = "";
  }

  function renderPersonalizedTasks() {
    clearTable();
    tasksToShow = hideCompleted
      ? tasksArray.filter((task) => !task.completed)
      : tasksArray;
    tasksToShow.forEach((task) => renderTask(task));
    updateTaskCount();
  }

  deleteBtn.addEventListener("click", function () {
    tasksArray = [];
    renderPersonalizedTasks();
  });

  function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      tasksArray = JSON.parse(savedTasks);
      renderPersonalizedTasks();
    }

    const savedHide = localStorage.getItem("hideCompleted");
    if (savedHide !== null) {
      hideCompleted = JSON.parse(savedHide);
      renderPersonalizedTasks();

      hideCompletedBtn.classList.toggle("toggled", hideCompleted);
    }
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
  }

  function renderTask(task) {
    const table = document
      .getElementById("tableID")
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    const nameCell = newRow.insertCell(0);
    nameCell.textContent = task.name;
    const priorityCell = newRow.insertCell(1);
    priorityCell.textContent = task.priority;
    const checkBoxCell = newRow.insertCell(2);
    const checkboxBtn = document.createElement("input");
    checkboxBtn.type = "checkbox";
    checkboxBtn.id = "checkbox";
    checkboxBtn.checked = task.completed;
    if (task.completed) {
      newRow.classList.add("done");
    }

    const index = tasksArray.indexOf(task);
    checkboxBtn.dataset.index = index;

    checkBoxCell.appendChild(checkboxBtn);

    checkboxBtn.addEventListener("change", function (event) {
      const i = parseInt(event.target.dataset.index, 10);
      tasksArray[i].completed = event.target.checked;

      newRow.classList.toggle("done", tasksArray[i].completed);

      saveTasksToLocalStorage();
      renderPersonalizedTasks();
    });
  }

  function insertTask() {
    const taskNameInputted = document.getElementById("name").value;
    const priorityInputted = document.getElementById("selectid").value;
    const task = {
      name: taskNameInputted || "undefined task",
      priority: priorityInputted,
      completed: false,
    };

    tasksArray.push(task);
    renderPersonalizedTasks();
    saveTasksToLocalStorage();
  }

  function openModal() {
    overlay.style.display = "block";
    modalBox.style.display = "flex";
  }

  function closeModal() {
    overlay.style.display = "none";
    modalBox.style.display = "none";
  }

  addBtn.addEventListener("click", function () {
    openModal();
  });

  close.addEventListener("click", function () {
    closeModal();
  });

  overlay.addEventListener("click", function () {
    closeModal();
  });

  function updateTime() {
    const date = new Date();
    const options = {
      weekday: "long",
    };
    const time = date.toLocaleTimeString();
    const day = date.toLocaleDateString(undefined, options);
    document.querySelector(".date").innerHTML = `${day}, ${time}`;
  }

  setInterval(updateTime, 1000);
  updateTime();

  continueBtn.addEventListener("click", function () {
    insertTask();
    closeModal();
  });

  loadFromLocalStorage();

  hideCompletedBtn.classList.toggle("toggled", hideCompleted);
});
