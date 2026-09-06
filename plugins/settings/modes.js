import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "modes",
    aliases: ["botmode"],
    category: "settings",
    permission: "Owner",
    reaction: "🎛️",
    description: "Toggle prefixless or other modes",
    help: {
        overview: "Toggle prefixless or other modes",
        usage: ".modes <prefix|prefixless>",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "LUPIN ⚡: Toggle prefixless or other modes",
        "SWIFTBOT": "SWIFTBOT 🏎️: Toggle prefixless or other modes",
        "BULL_MD": "BULL 🐂: Toggle prefixless or other modes",
        "JOKER": "JOKER 🃏: Toggle prefixless or other modes",
        "DODGE_MD": "DODGE 🏎️: Toggle prefixless or other modes",
        "KOE": "KŌE 🌸: Toggle prefixless or other modes",
        "BUNNY_MD": "BUNNY 🐰: Toggle prefixless or other modes",
        "LUCIFER": "LUCIFER 🦇: Toggle prefixless or other modes",
        "ANGELS": "ANGELS 👼: Toggle prefixless or other modes",
        "ASTRA_X": "ASTRA 💫: Toggle prefixless or other modes"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a mode: prefix, prefixless, suffix, suffixless" }); return; }
    const mode = args[0].toLowerCase();
    await db.collection('bot_config').doc('command_settings').set({ mode: mode }, { merge: true });
    settings.set('mode', mode);
    await sock.sendMessage(chatId, { text: `✅ Bot mode updated to: ${mode}` });

        } catch (e) {
            console.error(`[${"modes"}] Error:`, e.message);
        }
    }
};
