import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "menu",
    aliases: ["helpall","commands","list"],
    category: "general",
    permission: "Public",
    reaction: "📂",
    description: "Displays all available commands",
    help: {
        overview: "Displays all available commands",
        usage: ".menu",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ Tactical manifest retrieved. Here are the tools for our next operation.\\n\\n{menu}",
        "SWIFTBOT": "⚡ Gear list loaded. Select your command directly.\\n\\n{menu}",
        "BULL_MD": "🐂 The arsenal is open. Choose your weapon.\\n\\n{menu}",
        "JOKER": "😂 Pick a card, any card! Welcome to the circus of commands!\\n\\n{menu}",
        "DODGE_MD": "🏎️ Dashboard illuminated. All gears ready to shift.\\n\\n{menu}",
        "KOE": "🌸 I have carefully gathered all my abilities for you to see...\\n\\n{menu}",
        "BUNNY_MD": "🐰 Look at all these fun carrots we can pull out! Here is the menu!\\n\\n{menu}",
        "LUCIFER": "🌑 The dark contract is open. Read the forbidden commands.\\n\\n{menu}",
        "ANGELS": "👼 Here is the divine scroll of how I can assist you today.\\n\\n{menu}",
        "ASTRA_X": "✨ Interface initialized. I have prepared an elegant list of capabilities.\\n\\n{menu}"
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    let cats = {};
    for (const [id, cmd] of commandManager.commands.entries()) {
        if (cmd.status === 'disabled') continue;
        const c = (cmd.category || 'general').toUpperCase();
        if (!cats[c]) cats[c] = [];
        cats[c].push(cmd.currentName || cmd.name);
    }
    let menuStr = `*🤖 ${options.BOT_NAME.toUpperCase()} MENU*\n*👤 Owner:* +${options.OWNER_NUMBER}\n*🏷️ Prefix:* ${currentPrefix || 'none'}\n\n`;
    for (const [c, cmds] of Object.entries(cats)) {
        menuStr += `*╭── ⟨ ${c} ⟩*\n`;
        menuStr += cmds.map(cmd => `*│ ⚡* ${currentPrefix}${cmd}`).join('\n');
        menuStr += `\n*╰─────────────*\n\n`;
    }
    let reply = (options.response || "").replace('{menu}', menuStr);
    if (!reply.includes('MENU')) reply = menuStr;
    await sock.sendMessage(chatId, { text: reply });

        } catch (e) {
            console.error(`[${"menu"}] Error:`, e.message);
        }
    }
};
