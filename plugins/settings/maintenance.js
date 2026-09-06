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
        "LUPIN_MD": "🕵️ We are going dark. Maintenance protocols initiated.",
        "SWIFTBOT": "⚡ System lockdown. Maintenance mode absolute.",
        "BULL_MD": "🐂 The gates are closed. Maintenance enforced.",
        "JOKER": "😂 Taking a coffee break! The bot is under construction.",
        "DODGE_MD": "🏎️ Entering the pit stop. Maintenance engaged.",
        "KOE": "🌸 I need some time to heal and rest. Maintenance active.",
        "BUNNY_MD": "🐰 Time for a quick nap and some fixes! Maintenance mode on!",
        "LUCIFER": "🌑 The abyss closes. Maintenance has begun.",
        "ANGELS": "👼 The system is resting peacefully for divine upgrades.",
        "ASTRA_X": "✨ Elegant system rest initiated. Maintenance active."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .maintenance on or off" }); return; }
    const val = args[0] === 'on' ? 'MAINTENANCE' : 'ACTIVE';
    await db.collection('bot_config').doc('settings').set({ status: val }, { merge: true });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Maintenance Mode is now ${val}` });

        } catch (e) {
            console.error(`[${"maintenance"}] Error:`, e.message);
        }
    }
};
