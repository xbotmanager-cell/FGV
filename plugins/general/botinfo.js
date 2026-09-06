import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "botinfo",
    aliases: ["stats"],
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
        "LUPIN_MD": "🕵️ I have silently inspected my digital vault. The machine details are ready for your eyes.",
        "SWIFTBOT": "⚡ System scan complete. No delays. Here are the current bot statistics.",
        "BULL_MD": "🐂 The system is standing strong. Check these performance numbers.",
        "JOKER": "😂 I asked my circuits how they are feeling... they said 'still alive'. Here is the bot report.",
        "DODGE_MD": "🏎️ Engine diagnostics finished. The speed meter says everything is running smoothly.",
        "KOE": "🌸 I checked my heart of data and gathered these details carefully for you.",
        "BUNNY_MD": "🐰 Quick hop through the system files! I found these useful details for you.",
        "LUCIFER": "🌑 From the shadows of the machine, I reveal the hidden system information.",
        "ANGELS": "👼 Everything is checked peacefully. Here is the information you requested.",
        "ASTRA_X": "✨ I have prepared a clean system overview specially for you."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const mem = os.freemem() / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;
    const reply = `*🤖 ${options.BOT_NAME} INFO*\n\n*Version:* ${options.VERSION}\n*Commands:* ${commandManager.commands.size}\n*Platform:* ${os.platform()}\n*RAM Free:* ${mem.toFixed(2)} MB / ${totalMem.toFixed(2)} MB\n*Uptime:* ${Math.floor(process.uptime() / 60)} minutes`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + reply });

        } catch (e) {
            console.error(`[${"botinfo"}] Error:`, e.message);
        }
    }
};
