import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "time",
    aliases: ["clock","date"],
    category: "general",
    permission: "Public",
    reaction: "🕒",
    description: "Shows current server time",
    help: {
        overview: "Shows current server time",
        usage: ".time",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Shows current server time",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows current server time",
        "BULL_MD": "BULL 🐂: Shows current server time",
        "JOKER": "JOKER 🃏: Shows current server time",
        "DODGE_MD": "DODGE 🏎️: Shows current server time",
        "KOE": "KŌE 🌸: Shows current server time",
        "BUNNY_MD": "BUNNY 🐰: Shows current server time",
        "LUCIFER": "LUCIFER 🦇: Shows current server time",
        "ANGELS": "ANGELS 👼: Shows current server time",
        "ASTRA_X": "ASTRA 💫: Shows current server time"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const time = new Date().toLocaleString();
    await sock.sendMessage(chatId, { text: (options.response || "") + `\n\n*Server Time:* ${time}` });

        } catch (e) {
            console.error(`[${"time"}] Error:`, e.message);
        }
    }
};
