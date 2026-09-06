import { db } from './utils/firebaseAdmin.js';
async function run() {
    try {
        await db.collection('commands').doc('test').set({ hello: 'world' });
        console.log("Write success!");
    } catch(e) {
        console.error("Write Error:", e.message);
    }
    process.exit(0);
}
run();
