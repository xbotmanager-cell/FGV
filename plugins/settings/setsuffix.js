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
        "LUPIN_MD": "🕵️ The closing signature of our operations has been altered.",
        "SWIFTBOT": "⚡ Trailing trigger overridden. Suffix modification absolute.",
        "BULL_MD": "🐂 The final word is set. Suffix changed.",
        "JOKER": "😂 Saving the best for last! Suffix updated.",
        "DODGE_MD": "🏎️ Exhaust notes tuned. The new suffix is applied.",
        "KOE": "🌸 The way our sentences end has changed... Suffix updated.",
        "BUNNY_MD": "🐰 The tail end is now different! Suffix changed!",
        "LUCIFER": "🌑 The closing shadow has shifted. Suffix altered.",
        "ANGELS": "👼 The final graceful note has been updated.",
        "ASTRA_X": "✨ The elegant command terminator has been seamlessly modified."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new suffix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ suffix: args[0] }, { merge: true });
    settings.set('suffix', args[0]);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Suffix updated to: ${args[0]}` });

        } catch (e) {
            console.error(`[${"setsuffix"}] Error:`, e.message);
        }
    }
};
