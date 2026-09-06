import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "addsudo",
    aliases: ["sudoadd"],
    category: "settings",
    permission: "Owner",
    reaction: "👑",
    description: "Add a sudo user",
    help: {
        overview: "Add a sudo user",
        usage: ".addsudo <number>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Add a sudo user",
        "SWIFTBOT": "SWIFTBOT 🏎️: Add a sudo user",
        "BULL_MD": "BULL 🐂: Add a sudo user",
        "JOKER": "JOKER 🃏: Add a sudo user",
        "DODGE_MD": "DODGE 🏎️: Add a sudo user",
        "KOE": "KŌE 🌸: Add a sudo user",
        "BUNNY_MD": "BUNNY 🐰: Add a sudo user",
        "LUCIFER": "LUCIFER 🦇: Add a sudo user",
        "ANGELS": "ANGELS 👼: Add a sudo user",
        "ASTRA_X": "ASTRA 💫: Add a sudo user"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to add." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).set({ addedAt: new Date().toISOString() });
    await sock.sendMessage(chatId, { text: `✅ Added ${num} to sudo users.` });

        } catch (e) {
            console.error(`[${"addsudo"}] Error:`, e.message);
        }
    }
};
