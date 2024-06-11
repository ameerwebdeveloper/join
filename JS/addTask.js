/**
 * Initialisiert die Anwendung durch Aufruf der Funktionen zur Anzeige des Gruppennamens, der Kategorien und der Benutzer.
 */
function init() {
    showGrName()
    showCategoris()
    showUsers()
}

/* **************************************  SHOWING ON FORM */

/**
 * Zeigt die Kategorien im Formular an, indem die Daten von der Datenbank abgerufen und die Dropdown-Liste aktualisiert wird.
 */
async function showCategoris() {
    try {
        let response = await getGroupDataFromDB()
        let categories = Object.values(response.category)
        let categorySelect = document.getElementById("category")
        categorySelect.innerHTML = ""
        for (let i = (categories.length - 1); i >= 0; i--) {
            categorySelect.innerHTML += `
            <option value="${categories[i]["id"]}">${categories[i]["category_name"]}</option>
            `;
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Zeigt die Benutzer im Formular an, indem die Daten von der Datenbank abgerufen und die Dropdown-Liste aktualisiert wird.
 */
async function showUsers() {
    try {
        let response = await getGroupDataFromDB()
        let users = Object.values(response.users)
        let userSelection = document.getElementById("assigento")
        userSelection.innerHTML = ""
        for (let i = (users.length - 1); i >= 0; i--) {
            let userId = users[i]["userId"]
            let userName = users[i]["userName"]
            userSelection.innerHTML += `
            <option value="${userId}" id="${userId}">${userName}</option>
            `;
        }
        showUserImage()
        stopPreloader()
    } catch (error) {
        console.log(error)
    }
}

/**
 * Zeigt das Bild des ausgewählten Benutzers im Formular an.
 */
async function showUserImage() {
    let userImagecontainer = document.getElementById("assigend-user")
    let response = await getGroupDataFromDB()
    let assigentoSelection = document.getElementById("assigento")
    let id = assigentoSelection.options[assigentoSelection.selectedIndex].id
    let userImageUrl = response.users[id]["userPhoto"]

    userImagecontainer.innerHTML = ""
    let newImg = document.createElement('img')
    newImg.src = `${userImageUrl}`;
    userImagecontainer.appendChild(newImg)
}

/* **************************************  ADDING TO DB */

/**
 * Fügt eine neue Aufgabe in die Datenbank ein.
 */
function saveTaskInDB() {
    let allAtributs = getTaskAttributs()
    let randomId = idGenerator()
    if (allAtributs) {
        database.ref('groups/' + currentGroup + '/tasks/' + randomId).set({
            id: randomId,
            title: allAtributs.title,
            date: allAtributs.date,
            category: allAtributs.category,
            urgency: allAtributs.urgency,
            description: allAtributs.description,
            assigento: allAtributs.assigento,
            stage: "backlog"
        })
        successfullOverlay()
    }
}

/**
 * Zeigt eine Erfolgsnachricht an und startet die Konfetti-Animation.
 */
function successfullOverlay() {
    let successfullOverlay = document.getElementById("successful-overlay")
    successfullOverlay.classList.remove("display-none")
    confettify()
}

/**
 * Holt die Attribute der Aufgabe aus dem Formular.
 * @returns {object|boolean} - Gibt die Attribute als Objekt zurück oder false, wenn ein Attribut fehlt.
 */
function getTaskAttributs() {
    let myDivs = ["title", "date", "category", "assigento", "urgency", "description"]
    let allAtributs = {}
    let i = 0;
    while (i < myDivs.length) {
        let value = getDivbyId(myDivs[i]);
        if (value) {
            removeRedOutline(myDivs[i])
            allAtributs[myDivs[i]] = value;
            i++
        } else {
            makeOutlineRed(myDivs[i])
            allAtributs = false;
            break;
        }
    }
    return allAtributs;
}

/**
 * Holt den Wert eines Formularelements anhand seiner ID.
 * @param {string} id - Die ID des Formularelements.
 * @returns {string} - Der Wert des Formularelements.
 */
function getDivbyId(id) {
    if (id == "urgency") {
        return document.querySelector(`input[name="${id}"]:checked`).value;
    }
    return document.getElementById(id).value
}

/**
 * Fügt einen neuen Benutzer in die Datenbank ein.
 */
async function addUser() {
    let userName = document.getElementById("user-name");
    let userEmail = document.getElementById("user-email")
    let randomId = idGenerator();
    if (userName.value) {
        database.ref('groups/' + currentGroup + '/users/' + randomId).set({
            userId: randomId,
            userName: userName.value,
            userEmail: userEmail.value,
            userPhoto: await uploadUserPhoto()
        })
        showUsers()
        hideDiv("add-user-overlay")
    } else {
        makeOutlineRed("user-name")
    }
}

/**
 * Bereinigt das Overlay für die Benutzererstellung.
 */
function cleanUserOverlay() {
    removeRedOutline("user-name")
    let addUserLable = document.getElementById("user_image_lable")
    let usernameInput = document.getElementById("user-name")

    addUserLable.style.backgroundImage = "";
    usernameInput.value = "";
}

/* ADDING USER PHOTO */

/**
 * Lädt das Benutzerbild hoch und gibt die Bild-URL zurück.
 * @returns {Promise<string>} - Die URL des hochgeladenen Benutzerbildes.
 */
async function uploadUserPhoto() {
    let imageInput = document.getElementById("user_image_input")
    if (imageInput.value) {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                if (reader.result) {
                    res(reader.result)
                }
            })
            reader.readAsDataURL(imageInput.files[0])
        })
    } else {
        return "../img/anonymous.png"
    }
}

/**
 * Zeigt eine Vorschau des Benutzerbildes an.
 */
function previewUserimage() {
    let imageInput = document.getElementById("user_image_input")
    let userimageLable = document.getElementById("user_image_lable")
    let reader = new FileReader()
    reader.onloadend = function () {
        userimageLable.style.backgroundImage = `url(${reader.result})`
        userimageLable.classList.add("image-preview-style")
    }
    reader.readAsDataURL(imageInput.files[0])
}

/**
 * Fügt eine neue Kategorie in die Datenbank ein.
 */
function addCategory() {
    let neuCategory = document.getElementById("new-catrgory");
    let id = idGenerator()
    if (neuCategory.value) {
        database.ref('groups/' + currentGroup + '/category/' + id).set({
            category_name: neuCategory.value,
            id: id
        })
        showCategoris()
        hideDiv("add-category-overlay")
    } else {
        makeOutlineRed("new-catrgory")
    }
}

/**
 * Bereinigt das Overlay für die Kategorieerstellung.
 */
function cleanCategoryOverlay() {
    removeRedOutline("new-catrgory")
    let categoryInput = document.getElementById("new-catrgory")
    categoryInput.value = "";
}

/* **************************************  NÜTZLICHE FUNKTIONEN */

/**
 * Generiert eine zufällige ID.
 * @returns {number} - Die generierte ID.
 */
function idGenerator() {
    let newId = Math.floor(Math.random() * 10) + Date.now();
    return newId;
}

/* SHOW AND HIDE OVERLAYS */
document.getElementById("add-user-overlay").addEventListener('click', e => {
    if (e.target.getAttribute('name') == 'overlay-background') {
        hideDiv("add-user-overlay")
    }
})
document.getElementById("add-category-overlay").addEventListener('click', e => {
    if (e.target.getAttribute('name') == 'overlay-background') {
        hideDiv("add-category-overlay")
    }
})

const jsConfetti = new JSConfetti()

/**
 * Startet die Konfetti-Animation.
 */
function confettify() {
    jsConfetti.addConfetti()
}
