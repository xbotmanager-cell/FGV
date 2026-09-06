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
        "LUPIN_MD": "LUPIN ⚡: Changes the bot name",
        "SWIFTBOT": "SWIFTBOT 🏎️: Changes the bot name",
        "BULL_MD": "BULL 🐂: Changes the bot name",
        "JOKER": "JOKER 🃏: Changes the bot name",
        "DODGE_MD": "DODGE 🏎️: Changes the bot name",
        "KOE": "KŌE 🌸: Changes the bot name",
        "BUNNY_MD": "BUNNY 🐰: Changes the bot name",
        "LUCIFER": "LUCIFER 🦇: Changes the bot name",
        "ANGELS": "ANGELS 👼: Changes the bot name",
        "ASTRA_X": "ASTRA 💫: Changes the bot name"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (args.length === 0) { await sock.sendMessage(chatId, { text: "❌ Please provide a new name." }); return; }
    const newName = args.join(' ');
    await db.collection('bot_config').doc('settings').set({ botname: newName }, { merge: true });
    settings.set('botname', newName);
    await sock.sendMessage(chatId, { text: `✅ Bot name updated to: ${newName}` });

        } catch (e) {
            console.error(`[${"setname"}] Error:`, e.message);
        }
    }
};
