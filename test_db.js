import { db } from './utils/firebaseAdmin.js';
async function run() {
    try {
        const snap = await db.collection('commands').get();
        console.log("Success! size:", snap.size);
    } catch(e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
run();
