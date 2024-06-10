async function init() {
    showGrName()
    await showTrash()
    checkEmptyTrash()

}


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

function restoreTask(id) {
    changeStage(id, "backlog")
    init()
}

function cleanScreen() {
    let trashScreen = document.getElementById("big-container")
    trashScreen.innerHTML = "";
}


function checkEmptyTrash() {
    let bigContainer = document.getElementById("big-container")
    if (bigContainer.childElementCount == 0) {
        showEmptyOverlay()
    }
}

function deleteTask(taskId) {
    database.ref('groups/' + currentGroup + '/tasks/' + taskId).remove()
    console.log("task removed ", taskId)
    init()
}