console.log("databse")


const firebaseConfig = {
    apiKey: "AIzaSyDve2_8KFP6k5fAqaAqVWsi2ank1mGlAyM",
    authDomain: "joinapp-75543.firebaseapp.com",
    databaseURL: "https://joinapp-75543-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "joinapp-75543",
    storageBucket: "joinapp-75543.appspot.com",
    messagingSenderId: "928187275554",
    appId: "1:928187275554:web:f84acea8ef954187de6d7b"
};

firebase.initializeApp(firebaseConfig)
let database = firebase.database();





function loadArrayFromLS(arrayInput) {
    let arrayAsString = localStorage.getItem(arrayInput)
    let myArray = JSON.parse(arrayAsString)
    return myArray;
}


function getGroupDataFromDB() {
    return new Promise((res, rej) => {
        try {
            let response = database.ref('groups/' + currentGroup)

            response.on('value', function (snapshot) {
                let data = snapshot.val();
                res(data)
            })
        }
        catch (error) {
            rej(error)
        }
    })
}

