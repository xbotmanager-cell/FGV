import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "delsudo",
    aliases: ["sudodel"],
    category: "settings",
    permission: "Owner",
    reaction: "👑",
    description: "Remove a sudo user",
    help: {
        overview: "Remove a sudo user",
        usage: ".delsudo <number>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Remove a sudo user",
        "SWIFTBOT": "SWIFTBOT 🏎️: Remove a sudo user",
        "BULL_MD": "BULL 🐂: Remove a sudo user",
        "JOKER": "JOKER 🃏: Remove a sudo user",
        "DODGE_MD": "DODGE 🏎️: Remove a sudo user",
        "KOE": "KŌE 🌸: Remove a sudo user",
        "BUNNY_MD": "BUNNY 🐰: Remove a sudo user",
        "LUCIFER": "LUCIFER 🦇: Remove a sudo user",
        "ANGELS": "ANGELS 👼: Remove a sudo user",
        "ASTRA_X": "ASTRA 💫: Remove a sudo user"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to remove." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).delete();
    await sock.sendMessage(chatId, { text: `✅ Removed ${num} from sudo users.` });

        } catch (e) {
            console.error(`[${"delsudo"}] Error:`, e.message);
        }
    }
};
