import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "help",
    aliases: ["info","h"],
    category: "general",
    permission: "Public",
    reaction: "ℹ️",
    description: "Shows detailed info about a specific command",
    help: {
        overview: "Shows detailed info about a specific command",
        usage: ".help <command>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ Here is the classified intel for this specific operation.",
        "SWIFTBOT": "⚡ Manual retrieved. Technical specifications absolute.",
        "BULL_MD": "🐂 The rules of engagement for this weapon. Read carefully.",
        "JOKER": "😂 Need a manual? Here is how to play with this toy!",
        "DODGE_MD": "🏎️ Here are the tuning details for this specific gear.",
        "KOE": "🌸 Let me gently explain how to use this ability...",
        "BUNNY_MD": "🐰 Here is a quick guide on how to do this fun trick!",
        "LUCIFER": "🌑 The forbidden knowledge of this spell is revealed.",
        "ANGELS": "👼 I have prepared a heavenly guide to assist you.",
        "ASTRA_X": "✨ Elegant documentation retrieved for your perusal."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (args.length === 0) {
        await sock.sendMessage(chatId, { text: `Please specify a command. Example: ${currentPrefix}help ping` });
        return;
    }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (target && target.config) {
        const tc = target.config;
        const helpObj = tc.help || {};
        const header = options.response ? (options.response + "\n\n") : "";
        const reply = header + `*╭── ⟨ ${(tc.name || '').toUpperCase()} COMMAND ⟩*\n*│*\n*│ 1️⃣ Overview:* ${helpObj.overview || tc.description}\n*│ 2️⃣ Usage:* ${helpObj.usage || tc.usage}\n*│ 3️⃣ Features:* ${(helpObj.features || []).join(', ')}\n*│ 4️⃣ Aliases:* ${(tc.aliases || []).join(', ') || 'None'}\n*│*\n*╰─────────────*`;
        await sock.sendMessage(chatId, { text: reply });
    } else {
        await sock.sendMessage(chatId, { text: `❌ Command '${args[0]}' not found.` });
    }

        } catch (e) {
            console.error(`[${"help"}] Error:`, e.message);
        }
    }
};
