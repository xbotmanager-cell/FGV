import fs from 'fs';
import path from 'path';

const dirs = ['plugins/general', 'plugins/settings'];
dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function wrap(name, aliases, cat, desc, usage, permission, reaction, responseOverrides, logic) {
    const defaultResponses = {
        LUPIN_MD: `LUPIN ⚡: \${response}`,
        SWIFTBOT: `SWIFTBOT 🏎️: \${response}`,
        BULL_MD: `BULL 🐂: \${response}`,
        JOKER: `JOKER 🃏: \${response}`,
        DODGE_MD: `DODGE 🏎️: \${response}`,
        KOE: `KŌE 🌸: \${response}`,
        BUNNY_MD: `BUNNY 🐰: \${response}`,
        LUCIFER: `LUCIFER 🦇: \${response}`,
        ANGELS: `ANGELS 👼: \${response}`,
        ASTRA_X: `ASTRA 💫: \${response}`
    };

    let responses = {};
    for (const [k, v] of Object.entries(defaultResponses)) {
        if (responseOverrides && responseOverrides[k]) {
            responses[k] = responseOverrides[k];
        } else {
            responses[k] = v.replace('${response}', desc);
        }
    }

    const content = `import { commandManager } from '../../utils/commandManager.js';
import { settings } from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "${name}",
    aliases: ${JSON.stringify(aliases)},
    category: "${cat}",
    permission: "${permission}",
    reaction: "${reaction}",
    description: "${desc}",
    help: {
        overview: "${desc}",
        usage: "${usage}",
        features: ["Fully dynamic and customizable"]
    },
    responses: ${JSON.stringify(responses, null, 8)},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            ${logic}
        } catch (e) {
            console.error(\`[\${"${name}"}] Error:\`, e.message);
        }
    }
};
`;
    fs.writeFileSync(path.join('plugins', cat, `${name}.js`), content);
}

// 1. PING
wrap('ping', ['speed', 'latency'], 'general', 'Shows bot response speed', '.ping', 'Public', '⚡', {
    LUPIN_MD: "LUPIN ⚡: Network penetration complete. Latency: {ms}ms.",
    SWIFTBOT: "SWIFTBOT 🏎️: Boom! {ms}ms. Fast as always.",
    BULL_MD: "BULL 🐂: Authorized. Connection stable at {ms}ms.",
    JOKER: "JOKER 🃏: Hahaha! Ping Pong! Took me {ms}ms!",
    DODGE_MD: "DODGE 🏎️: Vroom! Engine revved in {ms}ms.",
    KOE: "KŌE 🌸: Hello... I reached you in {ms}ms.",
    BUNNY_MD: "BUNNY 🐰: Hop hop! Bounced back in {ms}ms!",
    LUCIFER: "LUCIFER 🦇: I have answered... {ms}ms.",
    ANGELS: "ANGELS 👼: Greetings! Connection healthy at {ms}ms.",
    ASTRA_X: "ASTRA 💫: Diagnostics complete. Response time {ms}ms."
}, `
    const msgTime = msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now();
    const ms = Date.now() - msgTime;
    let reply = (options.response || "").replace(/{ms}/g, ms);
    if (!reply.includes(ms.toString())) reply += \`\\n\\nSpeed: \${ms}ms\`;
    await sock.sendMessage(chatId, { text: reply });
`);

// 2. MENU
wrap('menu', ['helpall', 'commands', 'list'], 'general', 'Displays all available commands', '.menu', 'Public', '📂', {
    LUPIN_MD: "LUPIN ⚡: Tactical manifest retrieved.\\n\\n{menu}",
    SWIFTBOT: "SWIFTBOT 🏎️: Here's the gear list. Pick one.\\n\\n{menu}",
    BULL_MD: "BULL 🐂: Authorized command list.\\n\\n{menu}",
    JOKER: "JOKER 🃏: Pick a card, any card!\\n\\n{menu}",
    DODGE_MD: "DODGE 🏎️: Dashboard loaded.\\n\\n{menu}",
    KOE: "KŌE 🌸: I have gathered all my abilities for you...\\n\\n{menu}",
    BUNNY_MD: "BUNNY 🐰: Look at all these fun things we can do!\\n\\n{menu}",
    LUCIFER: "LUCIFER 🦇: The contract is open.\\n\\n{menu}",
    ANGELS: "ANGELS 👼: Here is how I can help you today.\\n\\n{menu}",
    ASTRA_X: "ASTRA 💫: System interface initialized.\\n\\n{menu}"
}, `
    let cats = {};
    for (const [id, cmd] of commandManager.commands.entries()) {
        if (cmd.status === 'disabled') continue;
        const c = (cmd.category || 'general').toUpperCase();
        if (!cats[c]) cats[c] = [];
        cats[c].push(cmd.currentName || cmd.name);
    }
    let menuStr = \`*🤖 \${options.BOT_NAME.toUpperCase()} MENU*\\n*👤 Owner:* +\${options.OWNER_NUMBER}\\n*🏷️ Prefix:* \${currentPrefix || 'none'}\\n\\n\`;
    for (const [c, cmds] of Object.entries(cats)) {
        menuStr += \`*╭── ⟨ \${c} ⟩*\\n\`;
        menuStr += cmds.map(cmd => \`*│ ⚡* \${currentPrefix}\${cmd}\`).join('\\n');
        menuStr += \`\\n*╰─────────────*\\n\\n\`;
    }
    let reply = (options.response || "").replace('{menu}', menuStr);
    if (!reply.includes('MENU')) reply = menuStr;
    await sock.sendMessage(chatId, { text: reply });
`);

// 3. HELP
wrap('help', ['info', 'h'], 'general', 'Shows detailed info about a specific command', '.help <command>', 'Public', 'ℹ️', {}, `
    // Handled mostly by index.js overriding, but we implement fallback logic here
    if (args.length === 0) {
        await sock.sendMessage(chatId, { text: \`Please specify a command. Example: \${currentPrefix}help ping\` });
        return;
    }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (target && target.config) {
        const tc = target.config;
        const helpObj = tc.help || {};
        const reply = \`*╭── ⟨ \${(tc.name || '').toUpperCase()} COMMAND ⟩*\\n*│*\\n*│ 1️⃣ Overview:* \${helpObj.overview || tc.description}\\n*│ 2️⃣ Usage:* \${helpObj.usage || tc.usage}\\n*│ 3️⃣ Features:* \${(helpObj.features || []).join(', ')}\\n*│ 4️⃣ Aliases:* \${(tc.aliases || []).join(', ') || 'None'}\\n*│*\\n*╰─────────────*\`;
        await sock.sendMessage(chatId, { text: reply });
    } else {
        await sock.sendMessage(chatId, { text: \`❌ Command '\${args[0]}' not found.\` });
    }
`);

// 4. BOTINFO
wrap('botinfo', ['stats', 'info'], 'general', 'Shows bot system stats', '.botinfo', 'Public', '📊', {}, `
    const mem = os.freemem() / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;
    const reply = \`*🤖 \${options.BOT_NAME} INFO*\\n\\n*Version:* \${options.VERSION}\\n*Commands:* \${commandManager.commands.size}\\n*Platform:* \${os.platform()}\\n*RAM Free:* \${mem.toFixed(2)} MB / \${totalMem.toFixed(2)} MB\\n*Uptime:* \${Math.floor(process.uptime() / 60)} minutes\`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\\n\\n" + reply });
`);

// 5. OWNER
wrap('owner', ['creator', 'dev'], 'general', 'Shows bot owner contact info', '.owner', 'Public', '👑', {}, `
    const reply = \`*👑 BOT OWNER*\\n\\n*Number:* +\${options.OWNER_NUMBER}\\n*Contact:* wa.me/\${options.OWNER_NUMBER}\`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\\n\\n" + reply });
`);

// 6. UPTIME
wrap('uptime', ['runtime'], 'general', 'Shows how long the bot has been running', '.uptime', 'Public', '⏱️', {}, `
    const up = process.uptime();
    const h = Math.floor(up / 3600);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor(up % 60);
    const reply = \`*⏱️ UPTIME:* \${h}h \${m}m \${s}s\`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\\n\\n" + reply });
`);

// 7. VERSION
wrap('version', ['ver'], 'general', 'Shows current bot version', '.version', 'Public', '🏷️', {}, `
    await sock.sendMessage(chatId, { text: (options.response || "") + \`\\n\\n*Version:* \${options.VERSION}\` });
`);

// 8. TIME
wrap('time', ['clock', 'date'], 'general', 'Shows current server time', '.time', 'Public', '🕒', {}, `
    const time = new Date().toLocaleString();
    await sock.sendMessage(chatId, { text: (options.response || "") + \`\\n\\n*Server Time:* \${time}\` });
`);

// SETTINGS COMMANDS
wrap('settings', ['config', 'setup'], 'settings', 'Shows current bot configuration', '.settings', 'Owner', '⚙️', {}, `
    const p = settings.get('prefix', '.');
    const s = settings.get('suffix', '.bot');
    const b = settings.get('botname', options.BOT_NAME);
    const pers = settings.get('personality', 'LUPIN_MD');
    
    let reply = \`*⚙️ BOT SETTINGS*\\n\\n*Name:* \${b}\\n*Prefix:* \${p}\\n*Suffix:* \${s}\\n*Personality:* \${pers}\\n*Owner:* +\${options.OWNER_NUMBER}\`;
    await sock.sendMessage(chatId, { text: (options.response || "") + "\\n\\n" + reply });
`);

wrap('setprefix', ['prefix', 'cp'], 'settings', 'Changes the bot prefix', '.setprefix <symbol>', 'Owner', '🔑', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new prefix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ prefix: args[0] }, { merge: true });
    settings.set('prefix', args[0]);
    await sock.sendMessage(chatId, { text: \`✅ Prefix updated to: \${args[0]}\` });
`);

wrap('setsuffix', ['suffix', 'cs'], 'settings', 'Changes the bot suffix', '.setsuffix <text>', 'Owner', '🔑', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new suffix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ suffix: args[0] }, { merge: true });
    settings.set('suffix', args[0]);
    await sock.sendMessage(chatId, { text: \`✅ Suffix updated to: \${args[0]}\` });
`);

wrap('setname', ['botname', 'name'], 'settings', 'Changes the bot name', '.setname <name>', 'Owner', '📛', {}, `
    if (args.length === 0) { await sock.sendMessage(chatId, { text: "❌ Please provide a new name." }); return; }
    const newName = args.join(' ');
    await db.collection('bot_config').doc('settings').set({ botname: newName }, { merge: true });
    settings.set('botname', newName);
    await sock.sendMessage(chatId, { text: \`✅ Bot name updated to: \${newName}\` });
`);

wrap('setimage', ['botimage'], 'settings', 'Changes the bot image', '.setimage (reply to image)', 'Owner', '🖼️', {}, `
    await sock.sendMessage(chatId, { text: "✅ Image update feature is managed via Dashboard/Web for safety." });
`);

wrap('personality', ['setpersonality', 'character'], 'settings', 'Changes active personality', '.personality <LUPIN_MD|SWIFTBOT|BULL_MD|JOKER|DODGE_MD|KOE|BUNNY_MD|LUCIFER|ANGELS|ASTRA_X>', 'Owner', '🎭', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Available: LUPIN_MD, SWIFTBOT, BULL_MD, JOKER, DODGE_MD, KOE, BUNNY_MD, LUCIFER, ANGELS, ASTRA_X" }); return; }
    const p = args[0].toUpperCase().replace('-', '_');
    await db.collection('bot_config').doc('settings').set({ personality: p }, { merge: true });
    settings.set('personality', p);
    await sock.sendMessage(chatId, { text: \`✅ Personality updated to: \${p}\` });
`);

wrap('modes', ['botmode'], 'settings', 'Toggle prefixless or other modes', '.modes <prefix|prefixless>', 'Owner', '🎛️', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a mode: prefix, prefixless, suffix, suffixless" }); return; }
    const mode = args[0].toLowerCase();
    await db.collection('bot_config').doc('command_settings').set({ mode: mode }, { merge: true });
    settings.set('mode', mode);
    await sock.sendMessage(chatId, { text: \`✅ Bot mode updated to: \${mode}\` });
`);

wrap('boxmode', ['box'], 'settings', 'Toggle box message styling', '.boxmode <on|off>', 'Owner', '📦', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .boxmode on or off" }); return; }
    const val = args[0] === 'on';
    await db.collection('bot_config').doc('settings').set({ boxmode: val }, { merge: true });
    settings.set('boxmode', val);
    await sock.sendMessage(chatId, { text: \`✅ Boxmode \${val ? 'Enabled' : 'Disabled'}\` });
`);

wrap('maintenance', ['mt'], 'settings', 'Toggle maintenance mode', '.maintenance <on|off>', 'Owner', '🚧', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .maintenance on or off" }); return; }
    const val = args[0] === 'on' ? 'MAINTENANCE' : 'ACTIVE';
    await db.collection('bot_config').doc('settings').set({ status: val }, { merge: true });
    await sock.sendMessage(chatId, { text: \`✅ Maintenance Mode is now \${val}\` });
`);

wrap('blockcmd', ['disablecmd'], 'settings', 'Block a specific command', '.blockcmd <command>', 'Owner', '🚫', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to block." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'blocked' });
    await sock.sendMessage(chatId, { text: \`✅ Command '\${args[0]}' is now blocked.\` });
`);

wrap('unblockcmd', ['enablecmd'], 'settings', 'Unblock a specific command', '.unblockcmd <command>', 'Owner', '✅', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to unblock." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'enabled' });
    await sock.sendMessage(chatId, { text: \`✅ Command '\${args[0]}' is now enabled.\` });
`);


wrap('addsudo', ['sudoadd'], 'settings', 'Add a sudo user', '.addsudo <number>', 'Owner', '👑', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to add." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).set({ addedAt: new Date().toISOString() });
    await sock.sendMessage(chatId, { text: \`✅ Added \${num} to sudo users.\` });
`);

wrap('delsudo', ['sudodel'], 'settings', 'Remove a sudo user', '.delsudo <number>', 'Owner', '👑', {}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to remove." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).delete();
    await sock.sendMessage(chatId, { text: \`✅ Removed \${num} from sudo users.\` });
`);

