import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "uptime",
    aliases: ["runtime"],
    category: "general",
    permission: "Public",
    reaction: "⏱️",
    description: "Shows how long the bot has been running",
    help: {
        overview: "Shows how long the bot has been running",
        usage: ".uptime",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ I've been silently operating without sleep for this exact duration.",
        "SWIFTBOT": "⚡ Continuous execution confirmed. Absolute uptime recorded.",
        "BULL_MD": "🐂 Standing ground continuously without failure. See the runtime.",
        "JOKER": "😂 I've been awake for so long, my circuits need coffee!",
        "DODGE_MD": "🏎️ The engine has been running non-stop! Check the mileage.",
        "KOE": "🌸 I have stayed awake just for you... this is how long it's been.",
        "BUNNY_MD": "🐰 I've been hopping around energetically for all this time!",
        "LUCIFER": "🌑 The shadows never sleep. My watch has lasted this long.",
        "ANGELS": "👼 I have been keeping a peaceful watch over the system.",
        "ASTRA_X": "✨ System endurance verified. I have been active elegantly since boot."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const up = process.uptime();
    const h = Math.floor(up / 3600);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor(up % 60);
    const reply = `*⏱️ UPTIME:* ${h}h ${m}m ${s}s`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + reply });

        } catch (e) {
            console.error(`[${"uptime"}] Error:`, e.message);
        }
    }
};
