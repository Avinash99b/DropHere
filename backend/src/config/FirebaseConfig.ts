import firebase from 'firebase-admin';
import "dotenv/config"

const serviceAccountPath = process.env.SECRETS_DIR + "/service-account.json";

const serviceAccount = require(serviceAccountPath);

const admin = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://drop-here-446a7-default-rtdb.firebaseio.com"
})

export default admin