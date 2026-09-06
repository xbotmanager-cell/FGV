import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "setsuffix",
    aliases: ["suffix","cs"],
    category: "settings",
    permission: "Owner",
    reaction: "🔑",
    description: "Changes the bot suffix",
    help: {
        overview: "Changes the bot suffix",
        usage: ".setsuffix <text>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Changes the bot suffix",
        "SWIFTBOT": "SWIFTBOT 🏎️: Changes the bot suffix",
        "BULL_MD": "BULL 🐂: Changes the bot suffix",
        "JOKER": "JOKER 🃏: Changes the bot suffix",
        "DODGE_MD": "DODGE 🏎️: Changes the bot suffix",
        "KOE": "KŌE 🌸: Changes the bot suffix",
        "BUNNY_MD": "BUNNY 🐰: Changes the bot suffix",
        "LUCIFER": "LUCIFER 🦇: Changes the bot suffix",
        "ANGELS": "ANGELS 👼: Changes the bot suffix",
        "ASTRA_X": "ASTRA 💫: Changes the bot suffix"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new suffix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ suffix: args[0] }, { merge: true });
    settings.set('suffix', args[0]);
    await sock.sendMessage(chatId, { text: `✅ Suffix updated to: ${args[0]}` });

        } catch (e) {
            console.error(`[${"setsuffix"}] Error:`, e.message);
        }
    }
};
