import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "setimage",
    aliases: ["botimage"],
    category: "settings",
    permission: "Owner",
    reaction: "🖼️",
    description: "Changes the bot image",
    help: {
        overview: "Changes the bot image",
        usage: ".setimage (reply to image)",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ The face of our operation is best managed securely from the shadows of the dashboard.",
        "SWIFTBOT": "⚡ Visual override denied in chat. Utilize the web interface.",
        "BULL_MD": "🐂 Visuals must be forged in the main dashboard panel.",
        "JOKER": "😂 I'm camera shy here! Go use the dashboard for my new profile pic!",
        "DODGE_MD": "🏎️ Paint job requires a pit stop at the web dashboard.",
        "KOE": "🌸 Please use the beautiful dashboard to change my face gently.",
        "BUNNY_MD": "🐰 Hop over to the dashboard to give me a new look!",
        "LUCIFER": "🌑 My dark visage can only be altered from the web realm.",
        "ANGELS": "👼 Please visit the heavenly dashboard to update my portrait.",
        "ASTRA_X": "✨ For an elegant visual update, please utilize the web control panel."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    await sock.sendMessage(chatId, { text: (options.response || "") + "\n\n✅ Image update feature is managed via Dashboard/Web for safety." });

        } catch (e) {
            console.error(`[${"setimage"}] Error:`, e.message);
        }
    }
};
