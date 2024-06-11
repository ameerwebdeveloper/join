/**
 * Initialisiert die Anwendung durch Stoppen des Preloaders und Anzeigen des Warnungs-Overlays.
 */
function init() {
    stopPreloader()
    warinigOverlay()
}

/**
 * Registriert eine neue Gruppe und speichert die Standarddaten.
 */
async function saveGr() {
    let grName = document.getElementById("new-group-name").value
    let grPasscode = document.getElementById("new-group-passcode").value
    await saveGrName(grName)
    await saveGrPasscode(grPasscode, grName)
    await saveDefaultUser(grName)
    await saveDefaultcategories(grName)
    window.location = "./index.html"
}

/* STANDARD-DATEN IN NEUER GRUPPE */

/**
 * Speichert den Gruppennamen in der Datenbank.
 */
async function saveGrName(grName) {
    await database.ref('groups/' + grName).set({
        grName: grName
    })
}

/**
 * Speichert den Gruppenpasscode in der Datenbank.
 */
async function saveGrPasscode(grPasscode, grName) {
    await database.ref('groups/' + grName).set({
        passcode: grPasscode
    })
}

/**
 * Speichert den Standardbenutzer in der Datenbank.
 */
async function saveDefaultUser(grName) {
    await database.ref('groups/' + grName + "/users/" + "0").set({
        userId: "0",
        userName: "Anonymous",
        userPhoto: "../img/anonymous.png",
        userEmail: "Anonymous@yahoo.com"
    })
}

/**
 * Speichert die Standardkategorien in der Datenbank.
 */
async function saveDefaultcategories(grName) {
    let categories = ["shopping", "cleaning", "reparing"]
    categories.forEach(async (item, index, arr) => {
        await database.ref('groups/' + grName + "/category/" + index).set({
            category_name: item,
            id: index
        })
    })
}

/**
 * Führt den Login durch, indem die Eingaben validiert und die Autorisierung überprüft werden.
 */
function login() {
    let groupName = document.getElementById('group-login-name');
    let groupPasscode = document.getElementById('group-login-passcode');
    isvalid = validationCheck('group-login-name') && validationCheck('group-login-passcode')
    if (isvalid) {
        authorization(groupName.value, groupPasscode.value)
    }
}

/**
 * Überprüft das Eingabefeld auf Validität.
 * @param {string} inputId - Die ID des Eingabefeldes.
 * @returns {boolean} - True, wenn das Eingabefeld gültig ist, sonst False.
 */
function validationCheck(inputId) {
    let inputValue = document.getElementById(inputId).value
    removeRedOutline(inputId)
    if (!inputValue) {
        makeOutlineRed(inputId)
        return false;
    }
    return true;
}

/**
 * Überprüft die Autorisierung der Gruppe und leitet weiter, wenn erfolgreich.
 * @param {string} groupName - Der Gruppenname.
 * @param {string} groupPasscode - Der Gruppenpasscode.
 */
async function authorization(groupName, groupPasscode) {
    let response = await database.ref('groups/' + groupName)
    response.on('value', function (snapshot) {
        let data = snapshot.val();
        if (data && data.passcode == groupPasscode) {
            saveArrayInLS("currentGroup", groupName)
            gotoLocation("addTask.html")
        } else {
            showLoginError();
        }
    })
}

/**
 * Führt den Demo-Login durch und leitet weiter.
 */
function demoLogin() {
    saveArrayInLS("currentGroup", "DEMO")
    window.location = "./addTask.html"
}

/**
 * Zeigt einen Login-Fehler an.
 */
function showLoginError() {
    let loginError = document.getElementById("login-error")
    loginError.classList.remove("display-none");
}

/* LOKALER SPEICHER */

/**
 * Speichert ein Array im lokalen Speicher.
 * @param {string} key - Der Schlüssel.
 * @param {array} arrayInput - Das Array, das gespeichert werden soll.
 */
function saveArrayInLS(key, arrayInput) {
    let arrayAsString = JSON.stringify(arrayInput);
    localStorage.setItem(key, arrayAsString)
}

/**
 * Zeigt das Warnungs-Overlay an, wenn es noch nicht angezeigt wurde.
 */
function warinigOverlay() {
    if (!localStorage.getItem("isWarned")) {
        let warningBox = document.getElementById("warning-overlay")
        let progressBar = document.querySelector(".progress-bar")
        showWarningOverlay(warningBox)
        hideWarnigOerlay(warningBox)
        startProgressbar(progressBar)
    }
}

/**
 * Speichert den Status, dass die Warnung verstanden wurde, und entfernt das Overlay.
 */
function warningUnderstod() {
    saveArrayInLS("isWarned", true)
    removeClassList("warning-overlay", "animated-warning-overlay")
}

/**
 * Zeigt das Warnungs-Overlay an.
 * @param {element} warningBox - Das Warnungs-Overlay-Element.
 */
function showWarningOverlay(warningBox) {
    warningBox.classList.add("animated-warning-overlay")
    console.log("overlay Showed")
}

/**
 * Versteckt das Warnungs-Overlay nach einer bestimmten Zeit.
 * @param {element} warningBox - Das Warnungs-Overlay-Element.
 */
function hideWarnigOerlay(warningBox) {
    setTimeout(function () {
        warningBox.style.animation = "hide-the-slide 2s cubic-bezier(0.21,-0.95, 0.58, 1) forwards"
        console.log("warning-removed")
    }, 9800)
}

/**
 * Startet die Fortschrittsanzeige der Warnung.
 * @param {element} progressBar - Das Fortschrittsbalken-Element.
 */
function startProgressbar(progressBar) {
    for (let i = 2; i < 98; i++) {
        setTimeout(function () {
            progressBar.style.width = `${i}%`
        }, 100 * i)
    }
}
