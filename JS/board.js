

/**
 * Initialisiert das Board durch Bereinigung der Spalten und Anzeige der Aufgaben.
 */
async function init() {
  showGrName()
  cleanAllColumns();
  await showTasks()
  checkEmptyBord()
}

/**
 * Ruft die Aufgaben aus der Datenbank ab und zeigt sie in den entsprechenden Spalten an.
 */
async function showTasks() {
  let tasks = await callTasksFromDB()
  if (tasks) {
    // Zeigt Aufgaben in der "To Do"-Spalte an
    let todoTasks = filterByStage(tasks, "todo")
    filterByUrgency(todoTasks)
    gernarateTasks(todoTasks, "todo")

    // Zeigt Aufgaben in der "In Progress"-Spalte an
    let inprogressTasks = filterByStage(tasks, "inprogress")
    filterByUrgency(inprogressTasks)
    gernarateTasks(inprogressTasks, "inprogress")

    // Zeigt Aufgaben in der "Testing"-Spalte an
    let testingTasks = filterByStage(tasks, "testing")
    filterByUrgency(testingTasks)
    gernarateTasks(testingTasks, "testing")

    // Zeigt Aufgaben in der "Done"-Spalte an
    let doneTasks = filterByStage(tasks, "done")
    filterByUrgency(doneTasks)
    gernarateTasks(doneTasks, "done")
  }
}

/**
 * Ruft die Aufgaben von der Datenbank ab und gibt sie zurück.
 */
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

/**
 * Generiert HTML-Code für die Aufgaben und fügt sie der entsprechenden Spalte hinzu.
 */
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

/**
 * Generiert HTML-Code für die Navigationspfeile zum Ändern der Aufgabenstufen.
 */
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

/**
 * Ändert die Stufe einer Aufgabe auf die vorherige Stufe.
 */
function previousStage(id, stage) {
  if (stage == "inprogress") {
    changeStage(id, "todo")
  } else if (stage == "testing") {
    changeStage(id, "inprogress")
  } else if (stage == "done") {
    changeStage(id, "testing")
  }
  init()
}

/**
 * Ändert die Stufe einer Aufgabe auf die nächste Stufe.
 */
function nextStage(id, stage) {
  if (stage == "todo") {
    changeStage(id, "inprogress")
  } else if (stage == "inprogress") {
    changeStage(id, "testing")
  } else if (stage == "testing") {
    changeStage(id, "done")
  }
  init()
}

/**
 * Gibt die Hintergrundfarbe basierend auf der Dringlichkeitsstufe zurück.
 */
function UrgincyColor(urgency) {
  if (urgency == 2) {
    return "orange"
  }
  if (urgency == 3) {
    return "green"
  }
}

/**
 * Filtert die Aufgaben nach der angegebenen Stufe.
 */
function filterByStage(inputs, stage) {
  return inputs.filter(input => input.stage == stage)
}

/**
 * Sortiert die Aufgaben nach ihrer Dringlichkeitsstufe.
 */
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

/**
 * Bereinigt alle Spalten, indem der Inhalt der entsprechenden HTML-Elemente gelöscht wird.
 */
function cleanAllColumns() {
  let allColumns = document.querySelectorAll(".column-body")
  for (const column of allColumns) {
    column.innerHTML = ""
  }
}

/**
 * Löscht eine Aufgabe, indem deren Stufe auf "trash" geändert und die Seite neu geladen wird.
 */
function deleteItem(id) {
  changeStage(id, "trash")
  init()
}

const mycolumns = document.querySelectorAll('.column-body')

for (const mycolumn of mycolumns) {
  // Event-Listener für das Verschieben und Ablegen von Aufgaben
  mycolumn.addEventListener('dragover', dragOver);
  mycolumn.addEventListener('drop', drop);

  // Event-Listener für das Styling während des Drag & Drop-Vorgangs
  mycolumn.addEventListener('dragenter', dragEnter);
  mycolumn.addEventListener('dragleave', dragLeave);
}

let dragged;

/**
 * Speichert die ID der gezogenen Aufgabe.
 */
function rememberDragedItem(id) {
  dragged = id;
}

/**
 * Verhindert das Standardverhalten beim Ziehen über ein Element.
 */
function dragOver(e) {
  e.preventDefault()
}

/**
 * Ändert die Stufe der gezogenen Aufgabe und lädt die Seite neu.
 */
function drop() {
  let targetedContainer = this.id
  let curentColumn = document.getElementById(this.id)
  curentColumn.classList.remove("elementOver")
  changeStage(dragged, targetedContainer)
  init()
}

/**
 * Fügt das Styling hinzu, wenn eine Aufgabe in eine Spalte gezogen wird.
 */
function dragEnter() {
  console.log(" dragEnter")
  let curentColumn = document.getElementById(this.id)
  curentColumn.classList.add("elementOver")
}

/**
 * Entfernt das Styling, wenn eine Aufgabe eine Spalte verlässt.
 */
function dragLeave() {
  console.log(" dragLeave")
  let curentColumn = document.getElementById(this.id)
  curentColumn.classList.remove("elementOver")
}

/**
 * Überprüft, ob das Board leer ist, und zeigt eine entsprechende Nachricht an.
 */
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
