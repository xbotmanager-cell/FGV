import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

getDocs(collection(db, 'sessions')).then(snapshot => {
    console.log('client success, docs count:', snapshot.size);
}).catch(e => console.error('client error', e));
