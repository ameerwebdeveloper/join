/**
 * Initialisiert die Anwendung durch Aufruf der Funktionen zur Anzeige des Gruppennamens,
 * Bereinigung des Backlogs und Anzeige der Aufgaben auf dem Bildschirm.
 */
function init() {
    showGrName()
    cleanBacklog()
    showTasksOnScreen()
}

let nummberOfBacklogtasks = 0;

/**
 * Bereinigt den Backlog-Bereich, indem der Inhalt des entsprechenden HTML-Elements gelöscht wird.
 */
function cleanBacklog() {
    let backlogTasks = document.getElementById("backlog-tasks")
    backlogTasks.innerHTML = ""
}

/**
 * Zeigt die Aufgaben auf dem Bildschirm an, indem die Aufgaben, Benutzer und Kategorien
 * von der Datenbank abgerufen und in den Backlog-Bereich eingefügt werden.
 */
async function showTasksOnScreen() {
    let response = await getGroupDataFromDB()
    try {
        let tasks = Object.values(response.tasks)
        let users = response.users
        let categories = response.category
        for (let i = (tasks.length - 1); i >= 0; i--) {
            if (tasks[i]["stage"] == "backlog") {
                nummberOfBacklogtasks++;
                let htmlText = document.createElement("div")
                htmlText.textContent = genarateUserHtml(tasks[i]["assigento"], users)
                htmlText.textContent += genarateBacklogHtml(categories[tasks[i]["category"]]["category_name"], tasks[i]["description"], tasks[i]["id"])
                appendToBacklog(htmlText.innerText)
            }
        }
        checkEmpityBackog()
        stopPreloader()
    } catch (error) {
        console.log(error)
        checkEmpityBackog()
    }
}

/**
 * Überprüft, ob der Backlog leer ist, und zeigt eine entsprechende Nachricht an,
 * wenn keine Aufgaben vorhanden sind.
 */
function checkEmpityBackog() {
    if (nummberOfBacklogtasks < 1) {
        let backlogContainer = document.getElementById("backlog-tasks");
        let newDiv = document.createElement("div")
        newDiv.innerHTML = `
        <h2>NO TASKS FOUND</h2>
        `
        backlogContainer.appendChild(newDiv)
        backlogContainer.classList.add("empty-backlog")
        stopPreloader()
    }
}

/**
 * Fügt den gegebenen HTML-Text dem Backlog-Bereich hinzu.
 * @param {string} htmlTaxt - Der HTML-Text, der hinzugefügt werden soll.
 */
function appendToBacklog(htmlTaxt) {
    let backlogTasks = document.getElementById("backlog-tasks")
    let myDiv = document.createElement("div")
    myDiv.innerHTML = `${htmlTaxt}`
    myDiv.classList.add('backlog-content')
    backlogTasks.append(myDiv)
}

/**
 * Generiert den HTML-Code für die Benutzerinformationen.
 * @param {string} userId - Die ID des Benutzers.
 * @param {object} users - Das Benutzerobjekt.
 * @returns {string} - Der generierte HTML-Code.
 */
function genarateUserHtml(userId, users) {
    let userName = users[userId]["userName"]
    let userEmail = users[userId]["userEmail"]
    let userPhoto = users[userId]["userPhoto"]
    let htmlText = `            
    <div class="backlog-row-firs-child">
    <!--First box  -->
    <div class="user-info customBox">
        <img id="userImage" src="${userPhoto}" alt="myfoto">
        <div class="user-name-email">
            <p id="user-name">${userName}</p>
            <p id="user-email">${userEmail}</p>
        </div>
    </div>
`;
    return htmlText
}

/**
 * Generiert den HTML-Code für die Backlog-Details.
 * @param {string} category - Die Kategorie der Aufgabe.
 * @param {string} description - Die Beschreibung der Aufgabe.
 * @param {string} id - Die ID der Aufgabe.
 * @returns {string} - Der generierte HTML-Code.
 */
function genarateBacklogHtml(category, description, id) {
    let htmlText = `   
                <!--second  box  -->
                <div class="category customBox">
                    <p>${category}</p>
                </div>
                <!--third  box  -->
                <div class="ditails customBox">
                    <p>${description}</p>
                </div>
            </div>
            <div class="buttons backlog-row-second-child">
                <button onclick="pinTask(${id})">PIN</button>
                <button onclick="editTask(${id})">EDIT</button>
            </div>
    `;
    return htmlText
}

let editedTaskId;

/**
 * Bearbeitet eine Aufgabe, indem das Bearbeitungs-Overlay angezeigt und die Aufgabendaten geladen werden.
 * @param {string} taskId - Die ID der zu bearbeitenden Aufgabe.
 */
async function editTask(taskId) {
    editedTaskId = taskId;
    let response = await getGroupDataFromDB()
    showDiv("edit-overlay")
    await showCategoriesInEdit()
    await showUsersInEdit()
    let attributes = ["title", "date", "description", "category", "assigento", "urgency"]
    for (let i = 0; i < attributes.length; i++) {
        let attributeBox = document.getElementById(attributes[i])
        attributeBox.value = response.tasks[taskId][attributes[i]]
    }
}

/**
 * Zeigt alle vorhandenen Kategorien in der Kategoriewahl im Bearbeitungsmodus an.
 */
async function showCategoriesInEdit() {
    try {
        let response = await getGroupDataFromDB()
        let categories = Object.values(response.category)
        console.log(categories)
        let categorySelect = document.getElementById("category")
        categorySelect.innerHTML = ""
        for (let i = (categories.length - 1); i >= 0; i--) {
            categorySelect.innerHTML += `
            <option value="${categories[i]["id"]}" id="${categories[i]["id"]}}">${categories[i]["category_name"]}</option>
            `;
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Zeigt alle Benutzer in der Benutzerauswahl im Bearbeitungsmodus an.
 */
async function showUsersInEdit() {
    let response = await getGroupDataFromDB()
    let users = Object.values(response.users)
    let userSelect = document.getElementById("assigento")
    userSelect.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        userSelect.innerHTML += `
        <option value="${users[i].userId}" id="${users[i].userId}">${users[i].userName}</option>
        `;
    }
}

/**
 * Speichert die bearbeitete Aufgabe in der Datenbank und lädt die Seite neu.
 */
function saveEditedTask() {
    database.ref('groups/' + currentGroup + '/tasks/' + editedTaskId).update({
        title: getEditAttributs().title,
        date: getEditAttributs().date,
        category: getEditAttributs().category,
        urgency: getEditAttributs().urgency,
        description: getEditAttributs().description,
        assigento: getEditAttributs().assigento
    })
    location.reload();
}

/**
 * Holt die bearbeiteten Attribute der Aufgabe aus dem Formular.
 * @returns {object} - Die bearbeiteten Attribute der Aufgabe.
 */
function getEditAttributs() {
    let attributes = ["title", "date", "description", "category", "assigento", "urgency"]
    let valueOfAttributs = {};
    for (let i = 0; i < attributes.length; i++) {
        let inputValue = document.getElementById(attributes[i]).value
        valueOfAttributs[attributes[i]] = inputValue;
    }
    return valueOfAttributs;
}

/**
 * Pinned die Aufgabe und ändert deren Status zu "todo", lädt dann die Seite neu.
 * @param {string} id - Die ID der Aufgabe.
 */
function pinTask(id) {
    changeStage(id, "todo")
    location.reload();
}
