import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "owner",
    aliases: ["creator","dev"],
    category: "general",
    permission: "Public",
    reaction: "👑",
    description: "Shows bot owner contact info",
    help: {
        overview: "Shows bot owner contact info",
        usage: ".owner",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Shows bot owner contact info",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows bot owner contact info",
        "BULL_MD": "BULL 🐂: Shows bot owner contact info",
        "JOKER": "JOKER 🃏: Shows bot owner contact info",
        "DODGE_MD": "DODGE 🏎️: Shows bot owner contact info",
        "KOE": "KŌE 🌸: Shows bot owner contact info",
        "BUNNY_MD": "BUNNY 🐰: Shows bot owner contact info",
        "LUCIFER": "LUCIFER 🦇: Shows bot owner contact info",
        "ANGELS": "ANGELS 👼: Shows bot owner contact info",
        "ASTRA_X": "ASTRA 💫: Shows bot owner contact info"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const reply = `*👑 BOT OWNER*\n\n*Number:* +${options.OWNER_NUMBER}\n*Contact:* wa.me/${options.OWNER_NUMBER}`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\n\n" + reply });

        } catch (e) {
            console.error(`[${"owner"}] Error:`, e.message);
        }
    }
};
