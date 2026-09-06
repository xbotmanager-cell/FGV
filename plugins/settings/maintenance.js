import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "maintenance",
    aliases: ["mt"],
    category: "settings",
    permission: "Owner",
    reaction: "🚧",
    description: "Toggle maintenance mode",
    help: {
        overview: "Toggle maintenance mode",
        usage: ".maintenance <on|off>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Toggle maintenance mode",
        "SWIFTBOT": "SWIFTBOT 🏎️: Toggle maintenance mode",
        "BULL_MD": "BULL 🐂: Toggle maintenance mode",
        "JOKER": "JOKER 🃏: Toggle maintenance mode",
        "DODGE_MD": "DODGE 🏎️: Toggle maintenance mode",
        "KOE": "KŌE 🌸: Toggle maintenance mode",
        "BUNNY_MD": "BUNNY 🐰: Toggle maintenance mode",
        "LUCIFER": "LUCIFER 🦇: Toggle maintenance mode",
        "ANGELS": "ANGELS 👼: Toggle maintenance mode",
        "ASTRA_X": "ASTRA 💫: Toggle maintenance mode"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .maintenance on or off" }); return; }
    const val = args[0] === 'on' ? 'MAINTENANCE' : 'ACTIVE';
    await db.collection('bot_config').doc('settings').set({ status: val }, { merge: true });
    await sock.sendMessage(chatId, { text: `✅ Maintenance Mode is now ${val}` });

        } catch (e) {
            console.error(`[${"maintenance"}] Error:`, e.message);
        }
    }
};
