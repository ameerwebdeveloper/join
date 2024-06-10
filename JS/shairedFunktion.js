
preloaderMaker()
let timeId = setInterval(preloaderMaker, 1100)

function hideDiv(id) {
    let divId = document.getElementById(id)
    divId.classList.add('display-none')
    console.log("HIDE-DIV ", id)
}

function showDiv(id) {
    let divId = document.getElementById(id)
    divId.classList.remove('display-none')
    console.log("SHOW-DIV", id)

}
function removeClassList(id, clssList) {
    let divId = document.getElementById(id)
    divId.classList.remove(clssList)
    console.log("Class List Removed ", clssList)

}

function makeOutlineRed(id) {
    let targetedId = document.getElementById(id)
    targetedId.classList.add("red-outline")
}

function removeRedOutline(id) {
    let targetedId = document.getElementById(id)
    targetedId.classList.remove("red-outline")
}


// showing current gruop name on the Navigation
let currentGroup = loadArrayFromLS('currentGroup');
function showGrName() {
    document.getElementById("gr-name").innerHTML = `angemeldet as ${currentGroup}`
}



function changeStage(dragged, targetedContainer) {
    database.ref('groups/' + currentGroup + '/tasks/' + dragged).update({
        stage: targetedContainer,
    })
}


function logout() {
    console.log("Logedout")
    deleteArrayInLS("currentGroup")
    gotoLocation("index.html")
}

function reloadPage() {
    location.reload();
}
function deleteArrayInLS(key) {
    localStorage.removeItem(key);

}



function gotoLocation(url) {
    console.log(url)
    window.location.href = url
}


function openNavbar() {
    let navbarDiv = document.getElementById("nav-bar")
    navbarDiv.style.display = "flex"
}
function closeNavbar() {
    let navbarDiv = document.getElementById("nav-bar")
    navbarDiv.style.display = "none"
}




function preloaderMaker() {
    let preloaderContent = document.getElementById("pre-loader-content")
    console.log("Preloader")
    changeContentTimer(200, "LOADING.", preloaderContent)
    changeContentTimer(400, "LOADING..", preloaderContent)
    changeContentTimer(600, "LOADING...", preloaderContent)
    changeContentTimer(800, "LOADING....", preloaderContent)

}


function changeContentTimer(time, content, container) {
    setTimeout(function () {
        container.innerHTML = content;
    }, time)
}

function stopPreloader() {
    hideDiv("pre-loader")
    clearInterval(timeId)
    console.log("STOP preloader")
}


function showEmptyOverlay() {
    let emptyOverlay = document.getElementById("empty-overlay")
    emptyOverlay.classList.remove("display-none")
}