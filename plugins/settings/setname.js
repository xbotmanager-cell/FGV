import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "setname",
    aliases: ["botname","name"],
    category: "settings",
    permission: "Owner",
    reaction: "📛",
    description: "Changes the bot name",
    help: {
        overview: "Changes the bot name",
        usage: ".setname <name>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ A new alias for a new heist. Name updated.",
        "SWIFTBOT": "⚡ Designation overridden. New identification absolute.",
        "BULL_MD": "🐂 The title of power has been declared. Name changed.",
        "JOKER": "😂 New identity! Who am I today? Name updated!",
        "DODGE_MD": "🏎️ Repainting the chassis. New title applied.",
        "KOE": "🌸 You have given me a new identity... I will cherish it.",
        "BUNNY_MD": "🐰 A shiny new name tag just for me! Yay!",
        "LUCIFER": "🌑 The true name has been spoken and altered.",
        "ANGELS": "👼 My divine title has been gently rebranded.",
        "ASTRA_X": "✨ My elegant identity has been beautifully refreshed."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (args.length === 0) { await sock.sendMessage(chatId, { text: "❌ Please provide a new name." }); return; }
    const newName = args.join(' ');
    await db.collection('bot_config').doc('settings').set({ botname: newName }, { merge: true });
    settings.set('botname', newName);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Bot name updated to: ${newName}` });

        } catch (e) {
            console.error(`[${"setname"}] Error:`, e.message);
        }
    }
};
