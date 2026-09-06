import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "setimage",
    aliases: ["botimage"],
    category: "settings",
    permission: "Owner",
    reaction: "🖼️",
    description: "Changes the bot image",
    help: {
        overview: "Changes the bot image",
        usage: ".setimage (reply to image)",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Changes the bot image",
        "SWIFTBOT": "SWIFTBOT 🏎️: Changes the bot image",
        "BULL_MD": "BULL 🐂: Changes the bot image",
        "JOKER": "JOKER 🃏: Changes the bot image",
        "DODGE_MD": "DODGE 🏎️: Changes the bot image",
        "KOE": "KŌE 🌸: Changes the bot image",
        "BUNNY_MD": "BUNNY 🐰: Changes the bot image",
        "LUCIFER": "LUCIFER 🦇: Changes the bot image",
        "ANGELS": "ANGELS 👼: Changes the bot image",
        "ASTRA_X": "ASTRA 💫: Changes the bot image"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    await sock.sendMessage(chatId, { text: "✅ Image update feature is managed via Dashboard/Web for safety." });

        } catch (e) {
            console.error(`[${"setimage"}] Error:`, e.message);
        }
    }
};
