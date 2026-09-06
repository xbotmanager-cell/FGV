import { db } from './utils/firebaseAdmin.js';

async function clear() {
    const snap = await db.collection('commands').get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log("Cleared old commands.");
}
clear();
