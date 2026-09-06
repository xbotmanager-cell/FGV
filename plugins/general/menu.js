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
        "LUPIN_MD": "LUPIN ⚡: Tactical manifest retrieved.\\n\\n{menu}",
        "SWIFTBOT": "SWIFTBOT 🏎️: Here's the gear list. Pick one.\\n\\n{menu}",
        "BULL_MD": "BULL 🐂: Authorized command list.\\n\\n{menu}",
        "JOKER": "JOKER 🃏: Pick a card, any card!\\n\\n{menu}",
        "DODGE_MD": "DODGE 🏎️: Dashboard loaded.\\n\\n{menu}",
        "KOE": "KŌE 🌸: I have gathered all my abilities for you...\\n\\n{menu}",
        "BUNNY_MD": "BUNNY 🐰: Look at all these fun things we can do!\\n\\n{menu}",
        "LUCIFER": "LUCIFER 🦇: The contract is open.\\n\\n{menu}",
        "ANGELS": "ANGELS 👼: Here is how I can help you today.\\n\\n{menu}",
        "ASTRA_X": "ASTRA 💫: System interface initialized.\\n\\n{menu}"
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
