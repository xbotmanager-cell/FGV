import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "settings",
    aliases: ["config","setup"],
    category: "settings",
    permission: "Owner",
    reaction: "⚙️",
    description: "Shows current bot configuration",
    help: {
        overview: "Shows current bot configuration",
        usage: ".settings",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Shows current bot configuration",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows current bot configuration",
        "BULL_MD": "BULL 🐂: Shows current bot configuration",
        "JOKER": "JOKER 🃏: Shows current bot configuration",
        "DODGE_MD": "DODGE 🏎️: Shows current bot configuration",
        "KOE": "KŌE 🌸: Shows current bot configuration",
        "BUNNY_MD": "BUNNY 🐰: Shows current bot configuration",
        "LUCIFER": "LUCIFER 🦇: Shows current bot configuration",
        "ANGELS": "ANGELS 👼: Shows current bot configuration",
        "ASTRA_X": "ASTRA 💫: Shows current bot configuration"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const p = settings.get('prefix', '.');
    const s = settings.get('suffix', '.bot');
    const b = settings.get('botname', options.BOT_NAME);
    const pers = settings.get('personality', 'LUPIN_MD');
    
    let reply = `*⚙️ BOT SETTINGS*\n\n*Name:* ${b}\n*Prefix:* ${p}\n*Suffix:* ${s}\n*Personality:* ${pers}\n*Owner:* +${options.OWNER_NUMBER}`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\n\n" + reply });

        } catch (e) {
            console.error(`[${"settings"}] Error:`, e.message);
        }
    }
};
