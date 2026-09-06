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
        "LUPIN_MD": "LUPIN ⚡: Changes active personality",
        "SWIFTBOT": "SWIFTBOT 🏎️: Changes active personality",
        "BULL_MD": "BULL 🐂: Changes active personality",
        "JOKER": "JOKER 🃏: Changes active personality",
        "DODGE_MD": "DODGE 🏎️: Changes active personality",
        "KOE": "KŌE 🌸: Changes active personality",
        "BUNNY_MD": "BUNNY 🐰: Changes active personality",
        "LUCIFER": "LUCIFER 🦇: Changes active personality",
        "ANGELS": "ANGELS 👼: Changes active personality",
        "ASTRA_X": "ASTRA 💫: Changes active personality"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Available: LUPIN_MD, SWIFTBOT, BULL_MD, JOKER, DODGE_MD, KOE, BUNNY_MD, LUCIFER, ANGELS, ASTRA_X" }); return; }
    const p = args[0].toUpperCase().replace('-', '_');
    await db.collection('bot_config').doc('settings').set({ personality: p }, { merge: true });
    settings.set('personality', p);
    await sock.sendMessage(chatId, { text: `✅ Personality updated to: ${p}` });

        } catch (e) {
            console.error(`[${"personality"}] Error:`, e.message);
        }
    }
};
