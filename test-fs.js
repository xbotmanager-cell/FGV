import { default as admin } from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

const app = admin.initializeApp({
    credential: applicationDefault(),
    projectId: config.projectId
});

const db = getFirestore(app);
db.settings({ databaseId: config.firestoreDatabaseId });
// Use a test collection that definitely exists or create it
db.collection('test_init').doc('test').set({t: 1}).then(() => {
    console.log('db write success');
    return db.collection('test_init').get();
}).then(snapshot => {
    console.log('db read success, docs count:', snapshot.size);
}).catch(e => console.error('db error', e));
