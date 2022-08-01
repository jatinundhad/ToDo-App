let fetchData = localStorage.getItem("tasks");
let tasks = [];
let View;
let editable_index = -1;
let delete_id = -1;

if (localStorage.getItem("view") == null) {
  View = "Table View";
  localStorage.setItem("view", View);
} else {
  View = localStorage.getItem("view");
}

if (fetchData == null) {
  tasks = [];
} else {
  tasks = JSON.parse(fetchData);
}

// changing the mode of the display
function changeMode() {
  let selected, other;

  console.log(localStorage.getItem("view"));

  if (View == "Table View") {
    selected = document.getElementById("Table-view");
    other = document.getElementById("Grid-view");
  } else if (View == "Grid View") {
    selected = document.getElementById("Grid-view");
    other = document.getElementById("Table-view");
  }

  selected.style.backgroundColor = "";
  selected.style.color = "white";

  other.style.backgroundColor = "#caf0f8";
  other.style.border = "none";
  other.style.color = "black";
}

// set the view according to the selection
function view(e) {
  View = e.target.value;
  localStorage.setItem("view", View);
  changeMode();
  showAllTasks();
  showCompletedTask();
  searching();
}

// checking for task is already exist or not.
function alreadyExist(check) {
  var flag = false;
  console.log("kaise ho moj mai !!!");
  tasks.forEach((x) => {
    if (x.task.toLowerCase() == check.trim()) {
      flag = true;
    }
    console.log(x.task);
  });

  return flag;
}

function addmodal() {
  document.getElementById("submit").setAttribute("data-bs-toggle", "modal");
  document.getElementById("submit").setAttribute("data-bs-target", "#myModal");
}

function removemodal() {
  document.getElementById("submit").setAttribute("data-bs-toggle", "");
  document.getElementById("submit").setAttribute("data-bs-target", "");
}

//this function will add the task into the localstorage
function addtask() {
  let task = document.getElementById("task").value;
  addmodal();

  setTimeout(() => {
    if (alreadyExist(task.toLowerCase()) && task != "") {
      document.getElementById("submit").click();
      document.getElementById("modal-title").innerHTML = "Already Exist Error";
      document.getElementById("modal-title").style.color = "red";
      document.getElementById("modal-body").innerHTML =
        "Task is already Exist.";
      document.getElementById("close").style.backgroundColor = "red";
      document.getElementById("close").style.border = "none";
      document.getElementById("task").value = "";
    } else {
      if (task != "") {
        console.log(task);

        //getting the current date
        var currentDate = new Date();
        console.log("currentDate", currentDate);
        var date =
          (currentDate.getDate().toString().length == 1
            ? "0" + currentDate.getDate().toString()
            : currentDate.getDate().toString()) +
          "/" +
          (currentDate.getMonth().toString().length == 1
            ? "0" + (currentDate.getMonth() + 1).toString()
            : (currentDate.getMonth() + 1).toString()) +
          "/" +
          currentDate.getFullYear();
        console.log("Date", date);

        let newtask = {
          task: task.trim(),
          date: date,
          done: false,
          edit: false,
        };
        console.log(newtask);

        tasks.push(newtask);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        document.getElementById("task").value = "";

        showAllTasks();

        document.getElementById("submit").click();
        document.getElementById("modal-title").innerHTML = "Add Cofirmation";
        document.getElementById("modal-title").style.color = "Green";
        document.getElementById("modal-body").innerHTML =
          "Task has been added.";
        document.getElementById("close").style.backgroundColor = "green";
        document.getElementById("close").style.border = "none";

        document.getElementById("task").value = "";
      } else {
        removemodal();
      }
    }
  }, 100);
}

// it will show all the remaining task
function showAllTasks() {
  document.getElementById("content").innerHTML = "";

  if (View == "Table View") {
    document.getElementById(
      "content"
    ).innerHTML = `<table class="table table-striped table-bordered">
        <thead style="font-weight: bold; background-color: lightgrey;">
        <th>#</th>
                <th>Task</th>
                <th>Date</th>
                <th>Completed</th>
                <th>Edit</th>
                <th>Delete</th>
                </thead>
                <tbody id="tasks">
                
                </tbody>
                </table>`;

    let table = document.getElementById("tasks");
    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].done) {
        let row = table.insertRow(table.length);
        row.id = "r" + tasks[i].task;
        let cell = row.insertCell(0);
        cell.innerHTML = i + 1;
        cell = row.insertCell(1);
        cell.innerHTML = tasks[i].task;
        cell = row.insertCell(2);
        cell.innerHTML = tasks[i].date;
        cell = row.insertCell(3);
        cell.innerHTML = `<input class="form-check-input" type="checkbox"
                }" id="${i + 1}" onchange="Completed(this.id);" ${
          tasks[i].done ? "checked" : ""
        }></div>`;
        cell = row.insertCell(4);
        cell.innerHTML = `<img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" id="${
          "E" + i
        }" onclick="Edit(this.id);" width="20px" height="21px" data-toggle="tooltip" title="Edit" data-placement="top"/>`;
        cell = row.insertCell(5);
        cell.innerHTML = `<img id="${
          "img" + i
        }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px"
                    data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/>`;
      }
    }
  } else if (View == "Grid View") {
    document.getElementById(
      "content"
    ).innerHTML = `<div id="taskbox" class="container">
        <div class="row p-3 grids" style="font-weight: bold; background-color: lightgrey;">
            <div class="col">#</div>
            <div class="col">Task</div>
            <div class="col">Date</div>
            <div class="col">Completed</div>
            <div class="col">Edit</div>
            <div class="col">Delete</div>
        </div>

        <div id="tasklist">

        </div>
    </div>`;

    let allTask = "";
    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].done) {
        allTask += `<div class="row p-3 mt-3 mb-3 grids shadow" id="${
          "r" + tasks[i].task
        }" style="background-color: ${tasks[i].done ? "#e5e5e5" : "#a8dadc"};">
            <div class="col">${i + 1}</div>
            <div class="col">${tasks[i].task}</div>
            <div class="col">${tasks[i].date}</div>
            <div class="col form-check"><input class="form-check-input" type="checkbox" id="${
              i + 1
            }" onchange="Completed(this.id);" ${
          tasks[i].done ? "checked" : ""
        }></div>
            <div class="col"><img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" width="20px" id="${
              "E" + i
            }" onclick="Edit(this.id);"  height="21px" data-toggle="tooltip" title="Edit" data-placement="top" /></div>
            <div class="col"><img id="${
              "img" + i
            }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px" data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/></div>
                    </div>`;
      }
    }

    document.getElementById("tasklist").innerHTML = allTask;
    return allTask;
  }
}

// it will show all the completed task in another section
function showCompletedTask() {
  let c_tasks = "";
  if (View == "Table View") {
    document.getElementById("completedTask").innerHTML = `<table class="table">
        <tbody id="C_Task"></tbody>
        </table>`;
    let table = document.getElementById("C_Task");
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].done) {
        let row = table.insertRow(table.length);
        row.classList.add("table-success");
        // row.style.textAlign = "center";
        row.style.backgroundColor = "#c7f9cc";
        row.style.fontWeight = "bold";
        let cell = row.insertCell(0);
        cell.innerHTML = i + 1;
        cell = row.insertCell(1);
        cell.innerHTML = tasks[i].task;
        cell = row.insertCell(2);
        cell.innerHTML = tasks[i].date;
        cell = row.insertCell(3);
        cell.innerHTML = `<input class="form-check-input" type="checkbox"
                }" id="${i + 1}" onchange="Completed(this.id);" ${
          tasks[i].done ? "checked" : ""
        }></div>`;
        cell = row.insertCell(4);
        cell.innerHTML = "Completed";
        cell.style.color = "green";
        cell = row.insertCell(5);
        cell.innerHTML = `<img id="${
          "img" + i
        }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px"
                    data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/>`;
      }
    }
  } else if (View == "Grid View") {
    document.getElementById("completedTask").style.display = "";
    document.getElementById(
      "completedTask"
    ).innerHTML = `<div id="Completedtaskbox" class="container grids"></div>`;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].done) {
        c_tasks += `<div class="row p-3 mt-3 grids shadow mb-3" style="background-color: lightgreen; font-Weight:bold;"}">
                <div class="col">${i + 1}</div>
                <div class="col">${tasks[i].task}</div>
                <div class="col">${tasks[i].date}</div>
                <div class="col form-check"><input class="form-check-input" type="checkbox"
                    }" id="${i + 1}" onchange="Completed(this.id);" ${
          tasks[i].done ? "checked" : ""
        }></div>
                <div class="col" style="font-weight: bold; color: darkgreen;">Completed</div>
                <div class="col"
                    ><img id="${
                      "img" + i
                    }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px" data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/></div>
                </div>`;
      }
    }
    document.getElementById("Completedtaskbox").innerHTML = c_tasks;
    return c_tasks;
  }
}

let p = 1;

// it will update the task in localstorage
function updateTask() {
  let updated_task = document.getElementById("task").value;

  addmodal();

  setTimeout(() => {
    if (
      updated_task.toLowerCase() == tasks[editable_index].task.toLowerCase()
    ) {
      document.getElementById("modal-title").innerHTML = "No Change Error";
      document.getElementById("modal-title").style.color = "red";
      document.getElementById("close").style.backgroundColor = "red";
      document.getElementById("modal-body").innerHTML =
        "Task is as same as before.";
      if (p) {
        document.getElementById("submit").click();
        p--;
      }

      document.getElementById("task").value = tasks[editable_index].task;
    } else if (alreadyExist(updated_task.toLowerCase())) {
      document.getElementById("modal-title").innerHTML = "Already Exist Error";
      document.getElementById("modal-title").style.color = "red";
      document.getElementById("close").style.backgroundColor = "red";
      document.getElementById("modal-body").innerHTML =
        "Task is already Exist.";
      if (p) {
        document.getElementById("submit").click();
        p--;
      }

      document.getElementById("task").value = tasks[editable_index].task;
    } else {
      console.log("task", updated_task);
      if (updated_task != "") {
        tasks[editable_index].task = updated_task;
        var currentDate = new Date();
        console.log("currentDate", currentDate);
        var date =
          (currentDate.getDate().toString().length == 1
            ? "0" + currentDate.getDate().toString()
            : currentDate.getDate().toString()) +
          "/" +
          (currentDate.getMonth().toString().length == 1
            ? "0" + (currentDate.getMonth() + 1).toString()
            : (currentDate.getMonth() + 1).toString()) +
          "/" +
          currentDate.getFullYear();

        tasks[editable_index].date = date;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        if (search) {
          searching();
        } else {
          showAllTasks();
          showCompletedTask();
        }
        addButtonStyle();
        document.getElementById("modal-title").innerHTML = "Update Cofirmation";
        document.getElementById("modal-title").style.color = "Green";
        document.getElementById("modal-body").innerHTML =
          "Task has been updated.";
        document.getElementById("close").style.backgroundColor = "green";
        document.getElementById("close").style.border = "none";
        if (p) {
          document.getElementById("submit").click();
          p--;
        }
      } else {
        document.getElementById("modal-title").innerHTML = "Error";
        document.getElementById("modal-title").style.color = "red";
        document.getElementById("close").style.backgroundColor = "red";
        document.getElementById("modal-body").innerHTML =
          "You have entered invalid value.";
        if (p) {
          document.getElementById("submit").click();
          p--;
        }
      }
    }

    setTimeout(() => {
      removemodal();
      p = 1;
    }, 3000);
  }, 100);
}

// it is add button style
function addButtonStyle() {
  document.getElementById("task").value = "";
  document.getElementById("alert").classList.remove("alert-warning");
  document.getElementById("alert").classList.add("alert-info");
  document.getElementById("message").innerHTML = "Add Task";
  document.getElementById("submit").innerHTML = "Add";
  document.getElementById("submit").setAttribute("onClick", "addtask()");
}

// it is update button style
function updateButtonStyle() {
  document.getElementById("alert").classList.remove("alert-info");
  document.getElementById("alert").classList.add("alert-warning");
  document.getElementById("message").innerHTML = "Update the task here";
  document.getElementById("submit").innerHTML = "Update";
  document.getElementById("submit").setAttribute("onClick", "updateTask()");
}

// it will edit the format
// if Add Format ---> Update Format
// if Update Format ---> Add Format
function Edit(id) {
  // it will highlight the editable element
  id = parseInt(id.slice(1));

  if (!search) {
    if (View == "Table View") {
      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].done) {
          if (i != id) {
            document.getElementById("r" + tasks[i].task).style.backgroundColor =
              "";
            tasks[i].edit = false;
          } else {
            document.getElementById(
              "r" + tasks[id].task
            ).style.backgroundColor = "#a8dadc";
          }
        }
      }
    } else if (View == "Grid View") {
      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].done) {
          if (i != id) {
            document.getElementById("r" + tasks[i].task).style.backgroundColor =
              "#a8dadc";
            tasks[i].edit = false;
          } else {
            document.getElementById("r" + tasks[i].task).style.backgroundColor =
              "#00b4d8";
          }
        }
      }
    }
  } else {
    if (View == "Table View") {
      document.getElementById("r" + tasks[id].task).style.backgroundColor =
        "#a8dadc";
      let searchWord = document.getElementById("search").value;

      for (let i = 0; i < tasks.length; i++) {
        if (
          !tasks[i].done &&
          tasks[i].task.toLowerCase().includes(searchWord.toLowerCase())
        ) {
          if (i != id) {
            document.getElementById("r" + tasks[i].task).style.backgroundColor =
              "";
            tasks[i].edit = false;
          } else {
            document.getElementById(
              "r" + tasks[id].task
            ).style.backgroundColor = "#a8dadc";
          }
        }
      }
    } else if (View == "Grid View") {
      document.getElementById("r" + tasks[id].task).style.backgroundColor =
        "#00b4d8";
      let searchWord = document.getElementById("search").value;

      for (let i = 0; i < tasks.length; i++) {
        if (
          !tasks[i].done &&
          tasks[i].task.toLowerCase().includes(searchWord.toLowerCase())
        ) {
          if (i != id) {
            document.getElementById("r" + tasks[i].task).style.backgroundColor =
              "#a8dadc";
            tasks[i].edit = false;
          } else {
            document.getElementById("r" + tasks[i].task).style.backgroundColor =
              "#00b4d8";
          }
        }
      }
    }
  }

  if (!tasks[id].edit) {
    tasks[id].edit = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // it will change the whole format to update
    document.getElementById("task").value = tasks[id].task;
    document.getElementById("task").focus();
    updateButtonStyle();

    editable_index = id;
  } else {
    tasks[id].edit = false;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (View == "Table View") {
      document.getElementById("r" + tasks[id].task).style.backgroundColor = "";
    } else {
      document.getElementById("r" + tasks[id].task).style.backgroundColor =
        "#a8dadc";
    }

    // it will change the whole format to Add
    addButtonStyle();
  }
}

// it will delete a task from the localStorage
function Delete(id) {
  id = id.slice(3);
  delete_id = parseInt(id);
}

function deletetask() {
  // new Audio("delete_sound").play();
  tasks.splice(delete_id, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
  // setTimeout(() => {
  //     location.reload();
  // }, 1500);
}

// it mask done true if task done otherwise mark false
function Completed(i) {
  console.log("i", i);

  if (tasks[i - 1].done) {
    tasks[i - 1].done = false;
  } else {
    tasks[i - 1].done = true;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  searching();
}

// it search the task and display to the user
function searching() {
  search = true;

  let searchWord = document.getElementById("search").value;
  document.getElementById("heading2").style.display = "none";
  document.getElementById("completedTask").style.display = "none";
  document.getElementById("content").innerHTML = "";
  document.getElementById("heading1").innerHTML = "Search Results...";
  let allTask = "";

  let flag = true;

  if (searchWord == "") {
    search = false;

    document.getElementById(
      "content"
    ).innerHTML = `<div id="taskbox" class="container">
        <div class="row p-3 grids" style="font-weight: bold; background-color: lightgrey;">
            <div class="col">#</div>
            <div class="col">Task</div>
            <div class="col">Date</div>
            <div class="col">Completed</div>
            <div class="col">Edit</div>
            <div class="col">Delete</div>
        </div>

        <div id="tasklist">

        </div>
    </div>`;

    allTask = showAllTasks();
    let c_tasks = showCompletedTask();
    if (View == "Grid View") {
      document.getElementById("tasklist").innerHTML = allTask;
      document.getElementById("Completedtaskbox").innerHTML = c_tasks;
    }

    document.getElementById("heading1").innerHTML = "Remaining Task";
    document.getElementById("heading2").style.display = "";
    document.getElementById("completedTask").style.display = "";
    document.getElementById("completedTask").style.display = "";
    document.getElementById("heading1").innerHTML = "Remaining Task";
    flag = false;
  } else {
    if (View == "Table View") {
      document.getElementById(
        "content"
      ).innerHTML = `<table class="table table-striped table-bordered">
            <thead style="font-weight: bold; background-color: lightgrey;">
            <th>#</th>
                    <th>Task</th>
                    <th>Date</th>
                    <th>Completed</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    </thead>
                    <tbody id="tasks">
                    
                    </tbody>
                    </table>`;

      let table = document.getElementById("tasks");
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task.toLowerCase().includes(searchWord.toLowerCase())) {
          if (!tasks[i].done) {
            let row = table.insertRow(table.length);
            row.id = "r" + tasks[i].task;
            let cell = row.insertCell(0);
            cell.innerHTML = i + 1;
            cell = row.insertCell(1);
            cell.innerHTML = tasks[i].task;
            cell = row.insertCell(2);
            cell.innerHTML = tasks[i].date;
            cell = row.insertCell(3);
            cell.innerHTML = `<input class="form-check-input" type="checkbox"
                        }" id="${i + 1}" onchange="Completed(this.id);" ${
              tasks[i].done ? "checked" : ""
            }></div>`;
            cell = row.insertCell(4);
            cell.innerHTML = `<img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" id="${
              "E" + i
            }" onclick="Edit(this.id);" width="20px" height="21px" data-toggle="tooltip" title="Edit" data-placement="top"/>`;
            cell = row.insertCell(5);
            cell.innerHTML = `<img id="${
              "img" + i
            }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px"
                            data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/>`;
          } else {
            let row = table.insertRow(table.length);
            row.classList.add("table-success");
            row.style.backgroundColor = "#c7f9cc";
            row.style.fontWeight = "bold";
            let cell = row.insertCell(0);
            cell.innerHTML = i + 1;
            cell = row.insertCell(1);
            cell.innerHTML = tasks[i].task;
            cell = row.insertCell(2);
            cell.innerHTML = tasks[i].date;
            cell = row.insertCell(3);
            cell.innerHTML = `<input class="form-check-input" type="checkbox"
                            }" id="${i + 1}" onchange="Completed(this.id);" ${
              tasks[i].done ? "checked" : ""
            }></div>`;
            cell = row.insertCell(4);
            cell.innerHTML = "Completed";
            cell.style.color = "green";
            cell = row.insertCell(5);
            cell.innerHTML = `<img id="${
              "img" + i
            }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px"
                            data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/>`;
          }
          flag = false;
        }
      }
    } else if (View == "Grid View") {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task.toLowerCase().includes(searchWord.toLowerCase())) {
          if (!tasks[i].done) {
            allTask += `<div class="row p-3 mt-3 grids" id="${
              "r" + tasks[i].task
            }" style="background-color: ${
              tasks[i].done ? "#e5e5e5" : "#a8dadc"
            };">
                    <div class="col">${i + 1}</div>
                    <div class="col">${tasks[i].task}</div>
                    <div class="col">${tasks[i].date}</div>
                    <div class="col form-check"><input class="form-check-input" type="checkbox" id="${
                      i + 1
                    }" onchange="Completed(this.id);" ${
              tasks[i].done ? "checked" : ""
            }></div>
                    <div class="col"><img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" width="20px" id="${
                      "E" + i
                    }" onclick="Edit(this.id);"  height="21px" data-toggle="tooltip" title="Edit" data-placement="top" /></div>
                    <div class="col"><img id="${
                      "img" + i
                    }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px" data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/></div>
                            </div>`;
          } else {
            allTask += `<div class="row p-3 mt-3 grids" style="background-color: lightgreen; font-Weight:bold;"}">
                    <div class="col">${i + 1}</div>
                    <div class="col">${tasks[i].task}</div>
                    <div class="col">${tasks[i].date}</div>
                    <div class="col form-check"><input class="form-check-input" type="checkbox"
                        }" id="${i + 1}" onchange="Completed(this.id);" ${
              tasks[i].done ? "checked" : ""
            }></div>
                    <div class="col" style="font-weight: bold; color: darkgreen;">Completed</div>
                    <div class="col"
                        ><img id="${
                          "img" + i
                        }" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" onclick="Delete(this.id);" width="20px" height="21px" data-toggle="tooltip" title="Delete" data-placement="top" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/></div>
                    </div>`;
          }
          flag = false;
        }
      }
      document.getElementById("content").innerHTML = allTask;
    }
    if (flag) {
      document.getElementById("heading1").innerHTML =
        "Sorry!!!, Not any result found.";
      flag = false;
    }
  }
}

// calling the function at starting of the app
showAllTasks();
changeMode();
showCompletedTask();
searching();
