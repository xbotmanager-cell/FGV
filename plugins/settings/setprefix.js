import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "setprefix",
    aliases: ["prefix","cp"],
    category: "settings",
    permission: "Owner",
    reaction: "🔑",
    description: "Changes the bot prefix",
    help: {
        overview: "Changes the bot prefix",
        usage: ".setprefix <symbol>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Changes the bot prefix",
        "SWIFTBOT": "SWIFTBOT 🏎️: Changes the bot prefix",
        "BULL_MD": "BULL 🐂: Changes the bot prefix",
        "JOKER": "JOKER 🃏: Changes the bot prefix",
        "DODGE_MD": "DODGE 🏎️: Changes the bot prefix",
        "KOE": "KŌE 🌸: Changes the bot prefix",
        "BUNNY_MD": "BUNNY 🐰: Changes the bot prefix",
        "LUCIFER": "LUCIFER 🦇: Changes the bot prefix",
        "ANGELS": "ANGELS 👼: Changes the bot prefix",
        "ASTRA_X": "ASTRA 💫: Changes the bot prefix"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new prefix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ prefix: args[0] }, { merge: true });
    settings.set('prefix', args[0]);
    await sock.sendMessage(chatId, { text: `✅ Prefix updated to: ${args[0]}` });

        } catch (e) {
            console.error(`[${"setprefix"}] Error:`, e.message);
        }
    }
};
