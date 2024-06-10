
function init() {
    stopPreloader()
    warinigOverlay()
}


// registering new group
async function saveGr() {
    let grName = document.getElementById("new-group-name").value
    let grPasscode = document.getElementById("new-group-passcode").value
    await saveGrName(grName)
    await saveGrPasscode(grPasscode, grName)
    await saveDefaultUser(grName)
    await saveDefaultcategories(grName)
    window.location = "./index.html"

}


/* DEFAULT DATA IN NEU GRUOP */
async function saveGrName(grName) {
    await database.ref('groups/' + grName).set({
        grName: grName
    })
}
async function saveGrPasscode(grPasscode, grName) {
    await database.ref('groups/' + grName).set({
        passcode: grPasscode
    })
}

async function saveDefaultUser(grName) {
    await database.ref('groups/' + grName + "/users/" + "0").set({
        userId: "0",
        userName: "Anonymous",
        userPhoto: "../img/anonymous.png",
        userEmail: "Anonymous@yahoo.com"

    })
}


async function saveDefaultcategories(grName) {
    let categories = ["shopping", "cleaning", "reparing"]
    categories.forEach(async (item, index, arr) => {
        await database.ref('groups/' + grName + "/category/" + index).set({
            category_name: item,
            id: index
        })
    }
    )

}



// // LOGIN
function login() {
    let groupName = document.getElementById('group-login-name');
    let groupPasscode = document.getElementById('group-login-passcode');
    isvalid = validationCheck('group-login-name') && validationCheck('group-login-passcode')
    if (isvalid) {
        authorization(groupName.value, groupPasscode.value)
    }
}

//checing input felds
function validationCheck(inputId) {
    let inputValue = document.getElementById(inputId).value
    removeRedOutline(inputId)
    if (!inputValue) {
        makeOutlineRed(inputId)
        return false;
    }
    return true;
}


async function authorization(groupName, groupPasscode) {
    let response = await database.ref('groups/' + groupName)
    response.on('value', function (snapshot) {
        let data = snapshot.val();
        if (data && data.passcode == groupPasscode) {
            saveArrayInLS("currentGroup", groupName)
            gotoLocation("addTask.html")
        }
        else {
            showLoginError();
        }
    })
}



function demoLogin() {
    saveArrayInLS("currentGroup", "DEMO")
    window.location = "./addTask.html"
}


function showLoginError() {
    let loginError = document.getElementById("login-error")
    loginError.classList.remove("display-none");
}






/* LOCAL STORAGE */
function saveArrayInLS(key, arrayInput) {
    let arrayAsString = JSON.stringify(arrayInput);
    localStorage.setItem(key, arrayAsString)
}






function warinigOverlay() {
    if (!localStorage.getItem("isWarned")) {
        let warningBox = document.getElementById("warning-overlay")
        let progressBar = document.querySelector(".progress-bar")
        showWarningOverlay(warningBox)
        hideWarnigOerlay(warningBox)
        startProgressbar(progressBar)

    }
}

function warningUnderstod() {
    saveArrayInLS("isWarned", true)
    removeClassList("warning-overlay", "animated-warning-overlay")
}


function showWarningOverlay(warningBox) {
    warningBox.classList.add("animated-warning-overlay")
    console.log("overly Showed")
}
function hideWarnigOerlay(warningBox) {
    setTimeout(function () {
        warningBox.style.animation = "hide-the-slide 2s cubic-bezier(0.21,-0.95, 0.58, 1) forwards"
        console.log("warning-removed")
    }, 9800)
}
function startProgressbar(progressBar) {
    for (let i = 2; i < 98; i++) {
        setTimeout(function () {
            progressBar.style.width = `${i}%`
        }, 100 * i)

    }
}