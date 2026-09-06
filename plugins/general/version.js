import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "version",
    aliases: ["ver"],
    category: "general",
    permission: "Public",
    reaction: "🏷️",
    description: "Shows current bot version",
    help: {
        overview: "Shows current bot version",
        usage: ".version",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Shows current bot version",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows current bot version",
        "BULL_MD": "BULL 🐂: Shows current bot version",
        "JOKER": "JOKER 🃏: Shows current bot version",
        "DODGE_MD": "DODGE 🏎️: Shows current bot version",
        "KOE": "KŌE 🌸: Shows current bot version",
        "BUNNY_MD": "BUNNY 🐰: Shows current bot version",
        "LUCIFER": "LUCIFER 🦇: Shows current bot version",
        "ANGELS": "ANGELS 👼: Shows current bot version",
        "ASTRA_X": "ASTRA 💫: Shows current bot version"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    await sock.sendMessage(chatId, { text: (options.response || "") + `\n\n*Version:* ${options.VERSION}` });

        } catch (e) {
            console.error(`[${"version"}] Error:`, e.message);
        }
    }
};
