/**
 * Stoppt den Preloader.
 */
stopPreloader()

/**
 * Ändert die Seite und aktualisiert das Bild und die Liste basierend auf der angegebenen Seite.
 * @param {string} page - Der Name der Seite, die angezeigt werden soll.
 */
function changePage(page) {
    let image = document.getElementById("image") // Holt das Bild-Element.
    let list = document.getElementById("list") // Holt das Listen-Element.
    console.log(image)
    console.log(list)
    
    // Überprüft, welche Seite angezeigt werden soll, und aktualisiert das Bild und die Liste entsprechend.
    if (page == "add-task") {
        image.src = "../img/help1.png"
        list.innerHTML = `
        <p>- Choose a meaningful title</p>
        <p>- Select a category</p>
        <p>- Describe the task shortly</p>
        <p>- Select the due date</p>
        <p>- How urgent is the task?</p>
        <p>- Assign the task to a member of your group</p>
        `
    }
    else if (page == "backlog") {
        image.src = "../img/help2.png"
        list.innerHTML = `
        <p>- Your task will be added to the Backlog</p>
        <p>- From here you can pin it on the board</p>
        <p>- Or you will edit the task informations</p>
        `
    } else if (page == "board") {
        image.src = "../img/help3.png"
        list.innerHTML = `
        <p>- The tasks has a background color according to its urgency</p>
        <p>- You can change the task phase easily by Drag and Drop</p>
        `
    }
}
