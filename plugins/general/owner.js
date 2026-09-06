import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "owner",
    aliases: ["creator","dev"],
    category: "general",
    permission: "Public",
    reaction: "👑",
    description: "Shows bot owner contact info",
    help: {
        overview: "Shows bot owner contact info",
        usage: ".owner",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ Revealing the mastermind behind the shadows. Here is the architect.",
        "SWIFTBOT": "⚡ Admin registry queried. Owner contact verified.",
        "BULL_MD": "🐂 The commander of this system. Bow to the owner.",
        "JOKER": "😂 Want to talk to the boss? Don't tell them I sent you!",
        "DODGE_MD": "🏎️ Here's the chief mechanic who built this engine.",
        "KOE": "🌸 The one who gave me life... here is my creator's contact.",
        "BUNNY_MD": "🐰 Here is the person who feeds me carrots! The bot owner!",
        "LUCIFER": "🌑 The dark lord of this realm. Enter at your own risk.",
        "ANGELS": "👼 The benevolent creator of my system. Here is their contact.",
        "ASTRA_X": "✨ Accessing creator credentials. Here is the elegant architect."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const reply = `*👑 BOT OWNER*\n\n*Number:* +${options.OWNER_NUMBER}\n*Contact:* wa.me/${options.OWNER_NUMBER}`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + reply });

        } catch (e) {
            console.error(`[${"owner"}] Error:`, e.message);
        }
    }
};
