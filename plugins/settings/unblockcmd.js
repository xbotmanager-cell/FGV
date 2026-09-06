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
        "LUPIN_MD": "🕵️ The tool is back in the arsenal. Command unlocked.",
        "SWIFTBOT": "⚡ Execution restored. Command block lifted.",
        "BULL_MD": "🐂 The gates are open again. Command unblocked.",
        "JOKER": "😂 Here is your toy back! Command restored!",
        "DODGE_MD": "🏎️ Removing the brakes! Command unlocked.",
        "KOE": "🌸 I am free to speak that word once more...",
        "BUNNY_MD": "🐰 Bringing the carrot back out! Command enabled!",
        "LUCIFER": "🌑 The dark seal is broken. Command permitted.",
        "ANGELS": "👼 The restriction has been gracefully lifted.",
        "ASTRA_X": "✨ Elegant restoration complete. Command is now active."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to unblock." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'enabled' });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Command '${args[0]}' is now enabled.` });

        } catch (e) {
            console.error(`[${"unblockcmd"}] Error:`, e.message);
        }
    }
};
