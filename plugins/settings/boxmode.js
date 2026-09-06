import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "boxmode",
    aliases: ["box"],
    category: "settings",
    permission: "Owner",
    reaction: "📦",
    description: "Toggle box message styling",
    help: {
        overview: "Toggle box message styling",
        usage: ".boxmode <on|off>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Toggle box message styling",
        "SWIFTBOT": "SWIFTBOT 🏎️: Toggle box message styling",
        "BULL_MD": "BULL 🐂: Toggle box message styling",
        "JOKER": "JOKER 🃏: Toggle box message styling",
        "DODGE_MD": "DODGE 🏎️: Toggle box message styling",
        "KOE": "KŌE 🌸: Toggle box message styling",
        "BUNNY_MD": "BUNNY 🐰: Toggle box message styling",
        "LUCIFER": "LUCIFER 🦇: Toggle box message styling",
        "ANGELS": "ANGELS 👼: Toggle box message styling",
        "ASTRA_X": "ASTRA 💫: Toggle box message styling"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .boxmode on or off" }); return; }
    const val = args[0] === 'on';
    await db.collection('bot_config').doc('settings').set({ boxmode: val }, { merge: true });
    settings.set('boxmode', val);
    await sock.sendMessage(chatId, { text: `✅ Boxmode ${val ? 'Enabled' : 'Disabled'}` });

        } catch (e) {
            console.error(`[${"boxmode"}] Error:`, e.message);
        }
    }
};
