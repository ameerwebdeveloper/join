
console.log("BOARD JS")


async function init() {
  showGrName()
  cleanAllColumns();
  await showTasks()
  checkEmptyBord()
}




async function showTasks() {
  let tasks = await callTasksFromDB()
  if (tasks) {
    //SHOW TODO
    let todoTasks = filterByStage(tasks, "todo")
    filterByUrgency(todoTasks)
    gernarateTasks(todoTasks, "todo")

    //SHOW INPROGRESS
    let inprogressTasks = filterByStage(tasks, "inprogress")
    filterByUrgency(inprogressTasks)
    gernarateTasks(inprogressTasks, "inprogress")

    //SHOW TESTING
    let testingTasks = filterByStage(tasks, "testing")
    filterByUrgency(testingTasks)
    gernarateTasks(testingTasks, "testing")

    //SHOW DONE
    let doneTasks = filterByStage(tasks, "done")
    filterByUrgency(doneTasks)
    gernarateTasks(doneTasks, "done")

  }
}

async function callTasksFromDB() {
  let response = await getGroupDataFromDB()
  try {
    let tasks = Object.values(response.tasks)
    stopPreloader()
    return tasks;
  } catch (error) {
    showEmptyOverlay()
    stopPreloader()
  }
}

function gernarateTasks(tasks, columName) {
  for (let i = 0; i < tasks.length; i++) {
    let boardColumn = document.getElementById(columName)
    let title = tasks[i].title;
    let urgency = tasks[i].urgency;
    let taskId = tasks[i].id
    let stage = tasks[i].stage
    boardColumn.innerHTML +=
      `
          <div class="single-task" draggable="true"   id="${taskId}" ondragstart="rememberDragedItem(${taskId})">
               <div>${title}</div>
                <p class="material-symbols-outlined delete-icon" onclick="deleteItem(${taskId})">delete</p>
                 <div class="urgincy-light" style="background-color:${UrgincyColor(urgency)};"></div>
                 ${stageArrowGen(taskId, stage)}
          </div>
        
        `


  }
}




/* change stages only on mobile */

function stageArrowGen(taskId, stage) {

  let arrowHtmlText = `<div id="navigateStags">`
  if (stage != "done") {
    arrowHtmlText += `<p class="material-symbols-outlined next-stage" onclick="nextStage(${taskId},'${stage}')">navigate_next</p>`
  }
  if (stage != "todo") {

    arrowHtmlText += `<p class="material-symbols-outlined previous-stage" onclick="previousStage(${taskId},'${stage}')">navigate_before</p>`
  }
  arrowHtmlText += `</div>`

  return arrowHtmlText
}

function previousStage(id, stage) {

  if (stage == "inprogress") {
    changeStage(id, "todo")
  }
  else if (stage == "testing") {
    changeStage(id, "inprogress")
  }
  else if (stage == "done") {
    changeStage(id, "testing")
  }
  init()
}

function nextStage(id, stage) {
  if (stage == "todo") {
    changeStage(id, "inprogress")
  }
  else if (stage == "inprogress") {
    changeStage(id, "testing")
  }
  else if (stage == "testing") {
    changeStage(id, "done")
  }
  init()

}


function UrgincyColor(urgency) {
  if (urgency == 2) {
    return "orange"
  }
  if (urgency == 3) {
    return "green"
  }
}

function filterByStage(inputs, stage) {
  return inputs.filter(input => input.stage == stage)
}



function filterByUrgency(input) {
  input.sort(function (a, b) {
    if (a.urgency > b.urgency) {
      return 1;
    } else {
      return -1;
    }
  });
  return input
}




function cleanAllColumns() {
  let allColumns = document.querySelectorAll(".column-body")
  for (const column of allColumns) {
    column.innerHTML = ""
  }
}

function deleteItem(id) {
  changeStage(id, "trash")
  init()
}


const mycolumns = document.querySelectorAll('.column-body')

for (const mycolumn of mycolumns) {

  // Need to for moving
  mycolumn.addEventListener('dragover', dragOver);
  mycolumn.addEventListener('drop', drop);

  //for styling
  mycolumn.addEventListener('dragenter', dragEnter);
  mycolumn.addEventListener('dragleave', dragLeave);


}





let dragged;

function rememberDragedItem(id) {
  dragged = id;
}

function dragOver(e) {
  e.preventDefault()
}



function drop() {
  let targetedContainer = this.id

  let curentColumn = document.getElementById(this.id)
  curentColumn.classList.remove("elementOver")

  changeStage(dragged, targetedContainer)
  init()

}


function dragEnter() {
  console.log(" dragEnter")
  let curentColumn = document.getElementById(this.id)
  curentColumn.classList.add("elementOver")

}


function dragLeave() {
  console.log(" dragLeave")

  let curentColumn = document.getElementById(this.id)
  curentColumn.classList.remove("elementOver")


}


/* Responsive */





function checkEmptyBord() {
  let boardColumns = document.querySelectorAll(".column-body")
  let boardIsEmpty = true;
  for (let i = 0; i < boardColumns.length; i++) {
    let currentColumn = boardColumns[i]
    if (currentColumn.childElementCount > 0) {
      boardIsEmpty = false;
      i = 5;
    }
  }
  if (boardIsEmpty) {
    console.log("board is empty", boardIsEmpty)
    showEmptyOverlay()
  }
}