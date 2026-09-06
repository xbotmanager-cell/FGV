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
        "LUPIN_MD": "🕵️ That tool has been confiscated. Command locked.",
        "SWIFTBOT": "⚡ Execution denied. Command block absolute.",
        "BULL_MD": "🐂 The path is sealed. Command blocked by force.",
        "JOKER": "😂 Oops! Someone took that toy away! Command blocked.",
        "DODGE_MD": "🏎️ Throwing a wrench in the gears. Command locked.",
        "KOE": "🌸 I will no longer speak that word... it is blocked.",
        "BUNNY_MD": "🐰 Putting that carrot away! Command disabled.",
        "LUCIFER": "🌑 The dark seal has been placed. Command forbidden.",
        "ANGELS": "👼 That action has been peacefully restricted.",
        "ASTRA_X": "✨ Elegant restriction applied. Command is now disabled."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to block." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'blocked' });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Command '${args[0]}' is now blocked.` });

        } catch (e) {
            console.error(`[${"blockcmd"}] Error:`, e.message);
        }
    }
};
