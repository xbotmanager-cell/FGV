import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "botinfo",
    aliases: ["stats","info"],
    category: "general",
    permission: "Public",
    reaction: "📊",
    description: "Shows bot system stats",
    help: {
        overview: "Shows bot system stats",
        usage: ".botinfo",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Shows bot system stats",
        "SWIFTBOT": "SWIFTBOT 🏎️: Shows bot system stats",
        "BULL_MD": "BULL 🐂: Shows bot system stats",
        "JOKER": "JOKER 🃏: Shows bot system stats",
        "DODGE_MD": "DODGE 🏎️: Shows bot system stats",
        "KOE": "KŌE 🌸: Shows bot system stats",
        "BUNNY_MD": "BUNNY 🐰: Shows bot system stats",
        "LUCIFER": "LUCIFER 🦇: Shows bot system stats",
        "ANGELS": "ANGELS 👼: Shows bot system stats",
        "ASTRA_X": "ASTRA 💫: Shows bot system stats"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const mem = os.freemem() / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;
    const reply = `*🤖 ${options.BOT_NAME} INFO*\n\n*Version:* ${options.VERSION}\n*Commands:* ${commandManager.commands.size}\n*Platform:* ${os.platform()}\n*RAM Free:* ${mem.toFixed(2)} MB / ${totalMem.toFixed(2)} MB\n*Uptime:* ${Math.floor(process.uptime() / 60)} minutes`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\n\n" + reply });

        } catch (e) {
            console.error(`[${"botinfo"}] Error:`, e.message);
        }
    }
};
