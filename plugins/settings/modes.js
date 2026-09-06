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
        "LUPIN_MD": "🕵️ The rules of engagement have been stealthily altered.",
        "SWIFTBOT": "⚡ Operational mode overridden. System logic updated.",
        "BULL_MD": "🐂 The battle rules are set. Mode enforced.",
        "JOKER": "😂 Switching up the game! The mode has been flipped!",
        "DODGE_MD": "🏎️ Shifting gears! New operational mode engaged.",
        "KOE": "🌸 The way I listen to you has been gently changed...",
        "BUNNY_MD": "🐰 Flipping the switches! New mode activated!",
        "LUCIFER": "🌑 The dark laws of operation have shifted.",
        "ANGELS": "👼 The peaceful laws of engagement have been updated.",
        "ASTRA_X": "✨ The elegant interaction mode has been flawlessly applied."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a mode: prefix, prefixless, suffix, suffixless" }); return; }
    const mode = args[0].toLowerCase();
    await db.collection('bot_config').doc('command_settings').set({ mode: mode }, { merge: true });
    settings.set('mode', mode);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\n\n" : "") + `✅ Bot mode updated to: ${mode}` });

        } catch (e) {
            console.error(`[${"modes"}] Error:`, e.message);
        }
    }
};
