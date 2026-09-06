import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "personality",
    aliases: ["setpersonality","character"],
    category: "settings",
    permission: "Owner",
    reaction: "🎭",
    description: "Changes active personality",
    help: {
        overview: "Changes active personality",
        usage: ".personality <LUPIN_MD|SWIFTBOT|BULL_MD|JOKER|DODGE_MD|KOE|BUNNY_MD|LUCIFER|ANGELS|ASTRA_X>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ A new mask is worn. Personality parameters shifting.",
        "SWIFTBOT": "⚡ Behavioral matrix overridden. New persona active.",
        "BULL_MD": "🐂 The attitude has been hardened. Personality enforced.",
        "JOKER": "😂 Time to put on a new face! Let's get crazy!",
        "DODGE_MD": "🏎️ Switching driving modes! New personality engaged.",
        "KOE": "🌸 My feelings have changed to match your desires...",
        "BUNNY_MD": "🐰 Changing my mood! Ready to play in a new way!",
        "LUCIFER": "🌑 The soul of the machine darkens to the requested persona.",
        "ANGELS": "👼 My spirit has adapted to serve you with a new demeanor.",
        "ASTRA_X": "✨ Elegant behavioral shift complete. New persona active."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Available: LUPIN_MD, SWIFTBOT, BULL_MD, JOKER, DODGE_MD, KOE, BUNNY_MD, LUCIFER, ANGELS, ASTRA_X" }); return; }
    const p = args[0].toUpperCase().replace('-', '_');
    await db.collection('bot_config').doc('settings').set({ personality: p }, { merge: true });
    settings.set('personality', p);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Personality updated to: ${p}` });

        } catch (e) {
            console.error(`[${"personality"}] Error:`, e.message);
        }
    }
};
