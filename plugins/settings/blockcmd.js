import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "blockcmd",
    aliases: ["disablecmd"],
    category: "settings",
    permission: "Owner",
    reaction: "🚫",
    description: "Block a specific command",
    help: {
        overview: "Block a specific command",
        usage: ".blockcmd <command>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Block a specific command",
        "SWIFTBOT": "SWIFTBOT 🏎️: Block a specific command",
        "BULL_MD": "BULL 🐂: Block a specific command",
        "JOKER": "JOKER 🃏: Block a specific command",
        "DODGE_MD": "DODGE 🏎️: Block a specific command",
        "KOE": "KŌE 🌸: Block a specific command",
        "BUNNY_MD": "BUNNY 🐰: Block a specific command",
        "LUCIFER": "LUCIFER 🦇: Block a specific command",
        "ANGELS": "ANGELS 👼: Block a specific command",
        "ASTRA_X": "ASTRA 💫: Block a specific command"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to block." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'blocked' });
    await sock.sendMessage(chatId, { text: `✅ Command '${args[0]}' is now blocked.` });

        } catch (e) {
            console.error(`[${"blockcmd"}] Error:`, e.message);
        }
    }
};
