import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "boxmode",
    aliases: ["box"],
    category: "settings",
    permission: "Owner",
    reaction: "📦",
    description: "Toggle box message styling",
    help: {
        overview: "Toggle box message styling",
        usage: ".boxmode <on|off>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ The structural disguise of our messages has been toggled.",
        "SWIFTBOT": "⚡ Container formatting overridden. Box mode absolute.",
        "BULL_MD": "🐂 The rigid structure is set. Box mode enforced.",
        "JOKER": "😂 Thinking inside or outside the box? Mode toggled!",
        "DODGE_MD": "🏎️ Chassis framing adjusted. Box mode engaged.",
        "KOE": "🌸 I will shape my words as you requested...",
        "BUNNY_MD": "🐰 Putting things neatly in a box! (Or taking them out!)",
        "LUCIFER": "🌑 The dark borders of my words have been altered.",
        "ANGELS": "👼 The beautiful framing of my messages is now updated.",
        "ASTRA_X": "✨ The elegant structural presentation has been modified."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .boxmode on or off" }); return; }
    const val = args[0] === 'on';
    await db.collection('bot_config').doc('settings').set({ boxmode: val }, { merge: true });
    settings.set('boxmode', val);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Boxmode ${val ? 'Enabled' : 'Disabled'}` });

        } catch (e) {
            console.error(`[${"boxmode"}] Error:`, e.message);
        }
    }
};
