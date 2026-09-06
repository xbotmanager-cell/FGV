import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "delsudo",
    aliases: ["sudodel"],
    category: "settings",
    permission: "Owner",
    reaction: "👑",
    description: "Remove a sudo user",
    help: {
        overview: "Remove a sudo user",
        usage: ".delsudo <number>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ Executive access revoked. The operative is out.",
        "SWIFTBOT": "⚡ Privilege demotion absolute. Sudo access removed.",
        "BULL_MD": "🐂 The commander has been stripped of rank. Sudo removed.",
        "JOKER": "😂 VIP pass expired! Back to the normal line! Sudo removed.",
        "DODGE_MD": "🏎️ Taking back the spare keys. Sudo access revoked.",
        "KOE": "🌸 I must say goodbye to their special whispers...",
        "BUNNY_MD": "🐰 Taking away the magic wand! Sudo removed.",
        "LUCIFER": "🌑 The dark pact is severed. Sudo rights revoked.",
        "ANGELS": "👼 The guardian duties have been peacefully relieved.",
        "ASTRA_X": "✨ Elegant executive privileges have been flawlessly revoked."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to remove." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).delete();
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Removed ${num} from sudo users.` });

        } catch (e) {
            console.error(`[${"delsudo"}] Error:`, e.message);
        }
    }
};
