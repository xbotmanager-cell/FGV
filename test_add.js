import { db } from './utils/firebaseAdmin.js';
async function run() {
    try {
        await db.collection('command_logs').add({ test: 'world' });
        console.log("Add success!");
    } catch(e) {
        console.error("Add Error:", e.message);
    }
    process.exit(0);
}
run();
