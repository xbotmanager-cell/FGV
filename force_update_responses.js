import fs from 'fs';
import path from 'path';
import { db } from './utils/firebaseAdmin.js';

async function run() {
    const dirs = ['plugins/general', 'plugins/settings'];
    for (const d of dirs) {
        const files = fs.readdirSync(d).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const filepath = 'file://' + path.resolve(d, file);
            const module = await import(filepath);
            const cmd = module.default;
            const originalName = cmd.name.toLowerCase();
            
            try {
                const doc = await db.collection('commands').doc(originalName).get();
                if (doc.exists) {
                    await db.collection('commands').doc(originalName).update({
                        responses: cmd.responses
                    });
                    console.log(`Updated ${originalName} in DB`);
                }
            } catch (e) {
                console.error(`Failed to update ${originalName}`, e);
            }
        }
    }
    console.log("DB Force Update Complete.");
    process.exit(0);
}
run();
