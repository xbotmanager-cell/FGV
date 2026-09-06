import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "time",
    aliases: ["clock","date"],
    category: "general",
    permission: "Public",
    reaction: "🕒",
    description: "Shows current server time",
    help: {
        overview: "Shows current server time",
        usage: ".time",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ Time is a thief's best friend. Here is the exact moment.",
        "SWIFTBOT": "⚡ Temporal synchronization complete. Current timestamp absolute.",
        "BULL_MD": "🐂 Command the moment. The exact time is here.",
        "JOKER": "😂 Time to get a watch! Just kidding, here is the server time.",
        "DODGE_MD": "🏎️ Clocking the lap time. Here is the current temporal position.",
        "KOE": "🌸 Every second with you is precious. Here is our current time together.",
        "BUNNY_MD": "🐰 Tick tock! It's carrot time, but here is the official clock!",
        "LUCIFER": "🌑 The midnight hour approaches. Here is the current shadow of time.",
        "ANGELS": "👼 A beautiful moment in time. Here is the current clock.",
        "ASTRA_X": "✨ Temporal elegant alignment verified. Current time provided."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const time = new Date().toLocaleString();
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `*Server Time:* ${time}` });

        } catch (e) {
            console.error(`[${"time"}] Error:`, e.message);
        }
    }
};
