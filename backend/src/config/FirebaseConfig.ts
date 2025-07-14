import firebase from 'firebase-admin';

const serviceAccount = require("../../service-account.json")

const admin = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://drop-here-446a7-default-rtdb.firebaseio.com"
})

export default admin