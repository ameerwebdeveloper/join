/**
 * Startet den Preloader und aktualisiert ihn alle 1100 Millisekunden.
 */
preloaderMaker()
let timeId = setInterval(preloaderMaker, 1100)

/**
 * Versteckt ein HTML-Element, indem eine CSS-Klasse hinzugefügt wird.
 * @param {string} id - Die ID des HTML-Elements.
 */
function hideDiv(id) {
    let divId = document.getElementById(id)
    divId.classList.add('display-none')
    console.log("HIDE-DIV ", id)
}

/**
 * Zeigt ein HTML-Element an, indem eine CSS-Klasse entfernt wird.
 * @param {string} id - Die ID des HTML-Elements.
 */
function showDiv(id) {
    let divId = document.getElementById(id)
    divId.classList.remove('display-none')
    console.log("SHOW-DIV", id)
}

/**
 * Entfernt eine CSS-Klasse von einem HTML-Element.
 * @param {string} id - Die ID des HTML-Elements.
 * @param {string} clssList - Die zu entfernende CSS-Klasse.
 */
function removeClassList(id, clssList) {
    let divId = document.getElementById(id)
    divId.classList.remove(clssList)
    console.log("Class List Removed ", clssList)
}

/**
 * Fügt einer HTML-Element eine rote Umrandung hinzu.
 * @param {string} id - Die ID des HTML-Elements.
 */
function makeOutlineRed(id) {
    let targetedId = document.getElementById(id)
    targetedId.classList.add("red-outline")
}

/**
 * Entfernt die rote Umrandung von einem HTML-Element.
 * @param {string} id - Die ID des HTML-Elements.
 */
function removeRedOutline(id) {
    let targetedId = document.getElementById(id)
    targetedId.classList.remove("red-outline")
}

/**
 * Zeigt den aktuellen Gruppennamen in der Navigation an.
 */
let currentGroup = loadArrayFromLS('currentGroup');
function showGrName() {
    document.getElementById("gr-name").innerHTML = `angemeldet as ${currentGroup}`
}

/**
 * Ändert die Stufe einer Aufgabe in der Datenbank.
 * @param {string} dragged - Die ID der gezogenen Aufgabe.
 * @param {string} targetedContainer - Die Zielstufe.
 */
function changeStage(dragged, targetedContainer) {
    database.ref('groups/' + currentGroup + '/tasks/' + dragged).update({
        stage: targetedContainer,
    })
}

/**
 * Loggt den Benutzer aus, löscht die aktuellen Gruppendaten und leitet zur Indexseite weiter.
 */
function logout() {
    console.log("Logedout")
    deleteArrayInLS("currentGroup")
    gotoLocation("index.html")
}

/**
 * Lädt die aktuelle Seite neu.
 */
function reloadPage() {
    location.reload();
}

/**
 * Löscht ein Array aus dem lokalen Speicher.
 * @param {string} key - Der Schlüssel des Arrays im lokalen Speicher.
 */
function deleteArrayInLS(key) {
    localStorage.removeItem(key);
}

/**
 * Navigiert zu einer angegebenen URL.
 * @param {string} url - Die Ziel-URL.
 */
function gotoLocation(url) {
    console.log(url)
    window.location.href = url
}

/**
 * Öffnet die Navigationsleiste.
 */
function openNavbar() {
    let navbarDiv = document.getElementById("nav-bar")
    navbarDiv.style.display = "flex"
}

/**
 * Schließt die Navigationsleiste.
 */
function closeNavbar() {
    let navbarDiv = document.getElementById("nav-bar")
    navbarDiv.style.display = "none"
}

/**
 * Erstellt und aktualisiert den Preloader-Inhalt.
 */
function preloaderMaker() {
    let preloaderContent = document.getElementById("pre-loader-content")
    console.log("Preloader")
    changeContentTimer(200, "LOADING.", preloaderContent)
    changeContentTimer(400, "LOADING..", preloaderContent)
    changeContentTimer(600, "LOADING...", preloaderContent)
    changeContentTimer(800, "LOADING....", preloaderContent)
}

/**
 * Ändert den Inhalt eines Containers nach einer bestimmten Zeit.
 * @param {number} time - Die Verzögerungszeit in Millisekunden.
 * @param {string} content - Der neue Inhalt.
 * @param {element} container - Das Ziel-Element.
 */
function changeContentTimer(time, content, container) {
    setTimeout(function () {
        container.innerHTML = content;
    }, time)
}

/**
 * Stoppt den Preloader und versteckt ihn.
 */
function stopPreloader() {
    hideDiv("pre-loader")
    clearInterval(timeId)
    console.log("STOP preloader")
}

/**
 * Zeigt ein Overlay an, wenn keine Aufgaben vorhanden sind.
 */
function showEmptyOverlay() {
    let emptyOverlay = document.getElementById("empty-overlay")
    emptyOverlay.classList.remove("display-none")
}
