import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "version",
    aliases: ["ver"],
    category: "general",
    permission: "Public",
    reaction: "🏷️",
    description: "Shows current bot version",
    help: {
        overview: "Shows current bot version",
        usage: ".version",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ The current iteration of my tactical protocol is ready.",
        "SWIFTBOT": "⚡ Core software version absolute. No downgrades permitted.",
        "BULL_MD": "🐂 The strength of this build is measured by its version.",
        "JOKER": "😂 I'm currently on this version, still waiting for my humor upgrade!",
        "DODGE_MD": "🏎️ The latest engine tuning specs are right here.",
        "KOE": "🌸 My soul has grown into this exact version...",
        "BUNNY_MD": "🐰 My fluffy code has evolved to this version!",
        "LUCIFER": "🌑 The current chapter of my dark evolution.",
        "ANGELS": "👼 I have been gracefully updated to this heavenly version.",
        "ASTRA_X": "✨ My elegant software architecture is currently at this version."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `*Version:* ${options.VERSION}` });

        } catch (e) {
            console.error(`[${"version"}] Error:`, e.message);
        }
    }
};
