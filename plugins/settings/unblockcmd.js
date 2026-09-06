import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "unblockcmd",
    aliases: ["enablecmd"],
    category: "settings",
    permission: "Owner",
    reaction: "✅",
    description: "Unblock a specific command",
    help: {
        overview: "Unblock a specific command",
        usage: ".unblockcmd <command>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Unblock a specific command",
        "SWIFTBOT": "SWIFTBOT 🏎️: Unblock a specific command",
        "BULL_MD": "BULL 🐂: Unblock a specific command",
        "JOKER": "JOKER 🃏: Unblock a specific command",
        "DODGE_MD": "DODGE 🏎️: Unblock a specific command",
        "KOE": "KŌE 🌸: Unblock a specific command",
        "BUNNY_MD": "BUNNY 🐰: Unblock a specific command",
        "LUCIFER": "LUCIFER 🦇: Unblock a specific command",
        "ANGELS": "ANGELS 👼: Unblock a specific command",
        "ASTRA_X": "ASTRA 💫: Unblock a specific command"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to unblock." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'enabled' });
    await sock.sendMessage(chatId, { text: `✅ Command '${args[0]}' is now enabled.` });

        } catch (e) {
            console.error(`[${"unblockcmd"}] Error:`, e.message);
        }
    }
};
