import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "settings",
    aliases: ["config","setup"],
    category: "settings",
    permission: "Owner",
    reaction: "⚙️",
    description: "Shows current bot configuration",
    help: {
        overview: "Shows current bot configuration",
        usage: ".settings",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ I have quietly unlocked the control panel. Your tactical parameters are displayed below.",
        "SWIFTBOT": "⚡ Configuration matrix accessed. Current system parameters loaded.",
        "BULL_MD": "🐂 The core foundation of the bot. Behold the raw configuration.",
        "JOKER": "😂 Let's see what buttons we can press! Here are the current settings!",
        "DODGE_MD": "🏎️ Opening the hood. Here are the engine tuning specifications.",
        "KOE": "🌸 I am showing you my deepest inner settings. Please handle them carefully.",
        "BUNNY_MD": "🐰 Opening the magic box! Here are all the current tweaks and twirls!",
        "LUCIFER": "🌑 The dark rules of this realm are written here in the settings.",
        "ANGELS": "👼 The peaceful harmony of my configuration is laid out for you.",
        "ASTRA_X": "✨ Accessing the elegant control interface. Your personalized settings are ready."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const p = settings.get('prefix', '.');
    const s = settings.get('suffix', '.bot');
    const b = settings.get('botname', options.BOT_NAME);
    const pers = settings.get('personality', 'LUPIN_MD');
    
    let reply = `*⚙️ BOT SETTINGS*\n\n*Name:* ${b}\n*Prefix:* ${p}\n*Suffix:* ${s}\n*Personality:* ${pers}\n*Owner:* +${options.OWNER_NUMBER}`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + reply });

        } catch (e) {
            console.error(`[${"settings"}] Error:`, e.message);
        }
    }
};
