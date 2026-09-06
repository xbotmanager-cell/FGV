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
        "LUPIN_MD": "LUPIN ⚡: Shows detailed info about a specific command",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows detailed info about a specific command",
        "BULL_MD": "BULL 🐂: Shows detailed info about a specific command",
        "JOKER": "JOKER 🃏: Shows detailed info about a specific command",
        "DODGE_MD": "DODGE 🏎️: Shows detailed info about a specific command",
        "KOE": "KŌE 🌸: Shows detailed info about a specific command",
        "BUNNY_MD": "BUNNY 🐰: Shows detailed info about a specific command",
        "LUCIFER": "LUCIFER 🦇: Shows detailed info about a specific command",
        "ANGELS": "ANGELS 👼: Shows detailed info about a specific command",
        "ASTRA_X": "ASTRA 💫: Shows detailed info about a specific command"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    // Handled mostly by index.js overriding, but we implement fallback logic here
    if (args.length === 0) {
        await sock.sendMessage(chatId, { text: `Please specify a command. Example: ${currentPrefix}help ping` });
        return;
    }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (target && target.config) {
        const tc = target.config;
        const helpObj = tc.help || {};
        const reply = `*╭── ⟨ ${(tc.name || '').toUpperCase()} COMMAND ⟩*\n*│*\n*│ 1️⃣ Overview:* ${helpObj.overview || tc.description}\n*│ 2️⃣ Usage:* ${helpObj.usage || tc.usage}\n*│ 3️⃣ Features:* ${(helpObj.features || []).join(', ')}\n*│ 4️⃣ Aliases:* ${(tc.aliases || []).join(', ') || 'None'}\n*│*\n*╰─────────────*`;
        await sock.sendMessage(chatId, { text: reply });
    } else {
        await sock.sendMessage(chatId, { text: `❌ Command '${args[0]}' not found.` });
    }

        } catch (e) {
            console.error(`[${"help"}] Error:`, e.message);
        }
    }
};
