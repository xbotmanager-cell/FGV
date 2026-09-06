import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
firebase.initializeApp(config);
// maybe there is a way to pass databaseId?
// const db = firebase.firestore(firebase.app(), 'ai-studio-ert-b78b0312-f18d-4bc2-9d04-1adc028e38d9'); // Not supported?
const db = firebase.firestore();
console.log(db);
