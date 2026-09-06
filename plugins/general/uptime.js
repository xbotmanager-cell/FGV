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
        "LUPIN_MD": "LUPIN ⚡: Shows how long the bot has been running",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows how long the bot has been running",
        "BULL_MD": "BULL 🐂: Shows how long the bot has been running",
        "JOKER": "JOKER 🃏: Shows how long the bot has been running",
        "DODGE_MD": "DODGE 🏎️: Shows how long the bot has been running",
        "KOE": "KŌE 🌸: Shows how long the bot has been running",
        "BUNNY_MD": "BUNNY 🐰: Shows how long the bot has been running",
        "LUCIFER": "LUCIFER 🦇: Shows how long the bot has been running",
        "ANGELS": "ANGELS 👼: Shows how long the bot has been running",
        "ASTRA_X": "ASTRA 💫: Shows how long the bot has been running"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const up = process.uptime();
    const h = Math.floor(up / 3600);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor(up % 60);
    const reply = `*⏱️ UPTIME:* ${h}h ${m}m ${s}s`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\n\n" + reply });

        } catch (e) {
            console.error(`[${"uptime"}] Error:`, e.message);
        }
    }
};
