/**
 * Initialisiert die Anwendung durch Anzeigen des Gruppennamens,
 * Anzeigen der gelöschten Aufgaben (Trash) und Überprüfen, ob der Papierkorb leer ist.
 */
async function init() {
    showGrName()
    await showTrash()
    checkEmptyTrash()
}

/**
 * Zeigt die gelöschten Aufgaben (Trash) an, indem die Aufgaben von der Datenbank abgerufen,
 * der Bildschirm bereinigt und die Aufgaben, die sich im Papierkorb befinden, angezeigt werden.
 */
async function showTrash() {
    try {
        let response = await getGroupDataFromDB()
        let tasks = Object.values(response.tasks)
        cleanScreen();
        for (let i = 0; i < tasks.length; i++) {
            let taskStage = tasks[i]["stage"]
            if (taskStage == "trash") {
                showTrashOnScreen(tasks[i])
            }
        }
        stopPreloader()
    } catch (error) {
        console.log(error)
        stopPreloader()
    }
}

/**
 * Zeigt eine einzelne gelöschte Aufgabe auf dem Bildschirm an.
 * @param {object} task - Die Aufgabe, die angezeigt werden soll.
 */
function showTrashOnScreen(task) {
    let bigContainer = document.getElementById("big-container")
    let newDiv = document.createElement("div")
    newDiv.classList.add("singel-task")
    newDiv.innerHTML = "";
    newDiv.innerHTML += `
        <h3>${task["title"]}</h3>
        <p>${task["date"]}</p>
        <div class="task-icons">
        <p class="material-symbols-outlined restore-icon" onclick="restoreTask(${task["id"]})">settings_backup_restore</p>
        <p class="material-symbols-outlined delete-icon" onclick="deleteTask(${task["id"]})">delete</p>
        </div>
    `;
    bigContainer.appendChild(newDiv)
}

/**
 * Stellt eine gelöschte Aufgabe wieder her, indem deren Stufe auf "backlog" geändert wird.
 * @param {string} id - Die ID der Aufgabe, die wiederhergestellt werden soll.
 */
function restoreTask(id) {
    changeStage(id, "backlog")
    init()
}

/**
 * Bereinigt den Bildschirm, indem der Inhalt des Containers für gelöschte Aufgaben gelöscht wird.
 */
function cleanScreen() {
    let trashScreen = document.getElementById("big-container")
    trashScreen.innerHTML = "";
}

/**
 * Überprüft, ob der Papierkorb leer ist, und zeigt ein Overlay an, wenn keine Aufgaben im Papierkorb sind.
 */
function checkEmptyTrash() {
    let bigContainer = document.getElementById("big-container")
    if (bigContainer.childElementCount == 0) {
        showEmptyOverlay()
    }
}

/**
 * Löscht eine Aufgabe dauerhaft aus der Datenbank.
 * @param {string} taskId - Die ID der zu löschenden Aufgabe.
 */
function deleteTask(taskId) {
    database.ref('groups/' + currentGroup + '/tasks/' + taskId).remove()
    console.log("task removed ", taskId)
    init()
}
