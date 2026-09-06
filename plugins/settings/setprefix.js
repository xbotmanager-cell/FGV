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
        "LUPIN_MD": "🕵️ The secret knock has been changed. Prefix updated.",
        "SWIFTBOT": "⚡ Command trigger overridden. Prefix modification absolute.",
        "BULL_MD": "🐂 The new rule is set. The prefix has been forged.",
        "JOKER": "😂 New password? Don't forget this one! Prefix changed.",
        "DODGE_MD": "🏎️ Ignition key changed. New prefix is ready.",
        "KOE": "🌸 I will listen for this new gentle whisper now. Prefix updated.",
        "BUNNY_MD": "🐰 Got it! I'll start listening for the new prefix now!",
        "LUCIFER": "🌑 The dark sigil has been altered. Prefix changed.",
        "ANGELS": "👼 The divine calling symbol has been gently updated.",
        "ASTRA_X": "✨ The elegant command initiator has been seamlessly modified."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new prefix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ prefix: args[0] }, { merge: true });
    settings.set('prefix', args[0]);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Prefix updated to: ${args[0]}` });

        } catch (e) {
            console.error(`[${"setprefix"}] Error:`, e.message);
        }
    }
};
