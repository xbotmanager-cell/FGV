import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "addsudo",
    aliases: ["sudoadd"],
    category: "settings",
    permission: "Owner",
    reaction: "👑",
    description: "Add a sudo user",
    help: {
        overview: "Add a sudo user",
        usage: ".addsudo <number>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ A new operative has been granted executive access.",
        "SWIFTBOT": "⚡ Privilege escalation absolute. Sudo access granted.",
        "BULL_MD": "🐂 A new commander joins the ranks. Sudo enforced.",
        "JOKER": "😂 Look who just got the VIP pass! Sudo added.",
        "DODGE_MD": "🏎️ Handing over the spare keys. Sudo access engaged.",
        "KOE": "🌸 I will now listen deeply to this new person...",
        "BUNNY_MD": "🐰 A new friend with special powers! Sudo added!",
        "LUCIFER": "🌑 The dark pact expands. Sudo rights granted.",
        "ANGELS": "👼 A new guardian has been peacefully appointed.",
        "ASTRA_X": "✨ Elegant executive privileges have been flawlessly granted."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to add." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).set({ addedAt: new Date().toISOString() });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Added ${num} to sudo users.` });

        } catch (e) {
            console.error(`[${"addsudo"}] Error:`, e.message);
        }
    }
};
