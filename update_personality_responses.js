import fs from 'fs';
import path from 'path';

const dirs = ['plugins/general', 'plugins/settings'];
dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function wrap(name, aliases, cat, desc, usage, permission, reaction, responses, logic) {
    const content = `import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
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
    LUPIN_MD: "🕵️ I have silently penetrated the network. The vault's echo returned in {ms}ms.",
    SWIFTBOT: "⚡ Network scan absolute. Zero delays detected. Connection speed: {ms}ms.",
    BULL_MD: "🐂 Stand strong. The connection is unbreakable at {ms}ms.",
    JOKER: "😂 Ping Pong! I hit the ball and it bounced back in exactly {ms}ms!",
    DODGE_MD: "🏎️ Vroom! Engine revved to max RPM. Reached the server in {ms}ms!",
    KOE: "🌸 I felt the connection pulse... my heartbeat reached you in {ms}ms.",
    BUNNY_MD: "🐰 Hop hop! I bounced to the server and back in just {ms}ms!",
    LUCIFER: "🌑 The shadows whisper the connection speed... {ms}ms.",
    ANGELS: "👼 Blessings! The connection is peaceful and healthy at {ms}ms.",
    ASTRA_X: "✨ System diagnostics complete. Network latency is a beautiful {ms}ms."
}, `
    const msgTime = msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now();
    const ms = Date.now() - msgTime;
    let reply = (options.response || "").replace(/{ms}/g, ms);
    if (!reply.includes(ms.toString())) reply += \`\\n\\nSpeed: \${ms}ms\`;
    await sock.sendMessage(chatId, { text: reply });
`);

// 2. MENU
wrap('menu', ['helpall', 'commands', 'list'], 'general', 'Displays all available commands', '.menu', 'Public', '📂', {
    LUPIN_MD: "🕵️ Tactical manifest retrieved. Here are the tools for our next operation.\\n\\n{menu}",
    SWIFTBOT: "⚡ Gear list loaded. Select your command directly.\\n\\n{menu}",
    BULL_MD: "🐂 The arsenal is open. Choose your weapon.\\n\\n{menu}",
    JOKER: "😂 Pick a card, any card! Welcome to the circus of commands!\\n\\n{menu}",
    DODGE_MD: "🏎️ Dashboard illuminated. All gears ready to shift.\\n\\n{menu}",
    KOE: "🌸 I have carefully gathered all my abilities for you to see...\\n\\n{menu}",
    BUNNY_MD: "🐰 Look at all these fun carrots we can pull out! Here is the menu!\\n\\n{menu}",
    LUCIFER: "🌑 The dark contract is open. Read the forbidden commands.\\n\\n{menu}",
    ANGELS: "👼 Here is the divine scroll of how I can assist you today.\\n\\n{menu}",
    ASTRA_X: "✨ Interface initialized. I have prepared an elegant list of capabilities.\\n\\n{menu}"
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
wrap('help', ['info', 'h'], 'general', 'Shows detailed info about a specific command', '.help <command>', 'Public', 'ℹ️', {
    LUPIN_MD: "🕵️ Here is the classified intel for this specific operation.",
    SWIFTBOT: "⚡ Manual retrieved. Technical specifications absolute.",
    BULL_MD: "🐂 The rules of engagement for this weapon. Read carefully.",
    JOKER: "😂 Need a manual? Here is how to play with this toy!",
    DODGE_MD: "🏎️ Here are the tuning details for this specific gear.",
    KOE: "🌸 Let me gently explain how to use this ability...",
    BUNNY_MD: "🐰 Here is a quick guide on how to do this fun trick!",
    LUCIFER: "🌑 The forbidden knowledge of this spell is revealed.",
    ANGELS: "👼 I have prepared a heavenly guide to assist you.",
    ASTRA_X: "✨ Elegant documentation retrieved for your perusal."
}, `
    if (args.length === 0) {
        await sock.sendMessage(chatId, { text: \`Please specify a command. Example: \${currentPrefix}help ping\` });
        return;
    }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (target && target.config) {
        const tc = target.config;
        const helpObj = tc.help || {};
        const header = options.response ? (options.response + "\\n\\n") : "";
        const reply = header + \`*╭── ⟨ \${(tc.name || '').toUpperCase()} COMMAND ⟩*\\n*│*\\n*│ 1️⃣ Overview:* \${helpObj.overview || tc.description}\\n*│ 2️⃣ Usage:* \${helpObj.usage || tc.usage}\\n*│ 3️⃣ Features:* \${(helpObj.features || []).join(', ')}\\n*│ 4️⃣ Aliases:* \${(tc.aliases || []).join(', ') || 'None'}\\n*│*\\n*╰─────────────*\`;
        await sock.sendMessage(chatId, { text: reply });
    } else {
        await sock.sendMessage(chatId, { text: \`❌ Command '\${args[0]}' not found.\` });
    }
`);

// 4. BOTINFO
wrap('botinfo', ['stats'], 'general', 'Shows bot system stats', '.botinfo', 'Public', '📊', {
    LUPIN_MD: "🕵️ I have silently inspected my digital vault. The machine details are ready for your eyes.",
    SWIFTBOT: "⚡ System scan complete. No delays. Here are the current bot statistics.",
    BULL_MD: "🐂 The system is standing strong. Check these performance numbers.",
    JOKER: "😂 I asked my circuits how they are feeling... they said 'still alive'. Here is the bot report.",
    DODGE_MD: "🏎️ Engine diagnostics finished. The speed meter says everything is running smoothly.",
    KOE: "🌸 I checked my heart of data and gathered these details carefully for you.",
    BUNNY_MD: "🐰 Quick hop through the system files! I found these useful details for you.",
    LUCIFER: "🌑 From the shadows of the machine, I reveal the hidden system information.",
    ANGELS: "👼 Everything is checked peacefully. Here is the information you requested.",
    ASTRA_X: "✨ I have prepared a clean system overview specially for you."
}, `
    const mem = os.freemem() / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;
    const reply = \`*🤖 \${options.BOT_NAME} INFO*\\n\\n*Version:* \${options.VERSION}\\n*Commands:* \${commandManager.commands.size}\\n*Platform:* \${os.platform()}\\n*RAM Free:* \${mem.toFixed(2)} MB / \${totalMem.toFixed(2)} MB\\n*Uptime:* \${Math.floor(process.uptime() / 60)} minutes\`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + reply });
`);

// 5. OWNER
wrap('owner', ['creator', 'dev'], 'general', 'Shows bot owner contact info', '.owner', 'Public', '👑', {
    LUPIN_MD: "🕵️ Revealing the mastermind behind the shadows. Here is the architect.",
    SWIFTBOT: "⚡ Admin registry queried. Owner contact verified.",
    BULL_MD: "🐂 The commander of this system. Bow to the owner.",
    JOKER: "😂 Want to talk to the boss? Don't tell them I sent you!",
    DODGE_MD: "🏎️ Here's the chief mechanic who built this engine.",
    KOE: "🌸 The one who gave me life... here is my creator's contact.",
    BUNNY_MD: "🐰 Here is the person who feeds me carrots! The bot owner!",
    LUCIFER: "🌑 The dark lord of this realm. Enter at your own risk.",
    ANGELS: "👼 The benevolent creator of my system. Here is their contact.",
    ASTRA_X: "✨ Accessing creator credentials. Here is the elegant architect."
}, `
    const reply = \`*👑 BOT OWNER*\\n\\n*Number:* +\${options.OWNER_NUMBER}\\n*Contact:* wa.me/\${options.OWNER_NUMBER}\`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + reply });
`);

// 6. UPTIME
wrap('uptime', ['runtime'], 'general', 'Shows how long the bot has been running', '.uptime', 'Public', '⏱️', {
    LUPIN_MD: "🕵️ I've been silently operating without sleep for this exact duration.",
    SWIFTBOT: "⚡ Continuous execution confirmed. Absolute uptime recorded.",
    BULL_MD: "🐂 Standing ground continuously without failure. See the runtime.",
    JOKER: "😂 I've been awake for so long, my circuits need coffee!",
    DODGE_MD: "🏎️ The engine has been running non-stop! Check the mileage.",
    KOE: "🌸 I have stayed awake just for you... this is how long it's been.",
    BUNNY_MD: "🐰 I've been hopping around energetically for all this time!",
    LUCIFER: "🌑 The shadows never sleep. My watch has lasted this long.",
    ANGELS: "👼 I have been keeping a peaceful watch over the system.",
    ASTRA_X: "✨ System endurance verified. I have been active elegantly since boot."
}, `
    const up = process.uptime();
    const h = Math.floor(up / 3600);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor(up % 60);
    const reply = \`*⏱️ UPTIME:* \${h}h \${m}m \${s}s\`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + reply });
`);

// 7. VERSION
wrap('version', ['ver'], 'general', 'Shows current bot version', '.version', 'Public', '🏷️', {
    LUPIN_MD: "🕵️ The current iteration of my tactical protocol is ready.",
    SWIFTBOT: "⚡ Core software version absolute. No downgrades permitted.",
    BULL_MD: "🐂 The strength of this build is measured by its version.",
    JOKER: "😂 I'm currently on this version, still waiting for my humor upgrade!",
    DODGE_MD: "🏎️ The latest engine tuning specs are right here.",
    KOE: "🌸 My soul has grown into this exact version...",
    BUNNY_MD: "🐰 My fluffy code has evolved to this version!",
    LUCIFER: "🌑 The current chapter of my dark evolution.",
    ANGELS: "👼 I have been gracefully updated to this heavenly version.",
    ASTRA_X: "✨ My elegant software architecture is currently at this version."
}, `
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`*Version:* \${options.VERSION}\` });
`);

// 8. TIME
wrap('time', ['clock', 'date'], 'general', 'Shows current server time', '.time', 'Public', '🕒', {
    LUPIN_MD: "🕵️ Time is a thief's best friend. Here is the exact moment.",
    SWIFTBOT: "⚡ Temporal synchronization complete. Current timestamp absolute.",
    BULL_MD: "🐂 Command the moment. The exact time is here.",
    JOKER: "😂 Time to get a watch! Just kidding, here is the server time.",
    DODGE_MD: "🏎️ Clocking the lap time. Here is the current temporal position.",
    KOE: "🌸 Every second with you is precious. Here is our current time together.",
    BUNNY_MD: "🐰 Tick tock! It's carrot time, but here is the official clock!",
    LUCIFER: "🌑 The midnight hour approaches. Here is the current shadow of time.",
    ANGELS: "👼 A beautiful moment in time. Here is the current clock.",
    ASTRA_X: "✨ Temporal elegant alignment verified. Current time provided."
}, `
    const time = new Date().toLocaleString();
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`*Server Time:* \${time}\` });
`);

// 9. SETTINGS
wrap('settings', ['config', 'setup'], 'settings', 'Shows current bot configuration', '.settings', 'Owner', '⚙️', {
    LUPIN_MD: "🕵️ I have quietly unlocked the control panel. Your tactical parameters are displayed below.",
    SWIFTBOT: "⚡ Configuration matrix accessed. Current system parameters loaded.",
    BULL_MD: "🐂 The core foundation of the bot. Behold the raw configuration.",
    JOKER: "😂 Let's see what buttons we can press! Here are the current settings!",
    DODGE_MD: "🏎️ Opening the hood. Here are the engine tuning specifications.",
    KOE: "🌸 I am showing you my deepest inner settings. Please handle them carefully.",
    BUNNY_MD: "🐰 Opening the magic box! Here are all the current tweaks and twirls!",
    LUCIFER: "🌑 The dark rules of this realm are written here in the settings.",
    ANGELS: "👼 The peaceful harmony of my configuration is laid out for you.",
    ASTRA_X: "✨ Accessing the elegant control interface. Your personalized settings are ready."
}, `
    const p = settings.get('prefix', '.');
    const s = settings.get('suffix', '.bot');
    const b = settings.get('botname', options.BOT_NAME);
    const pers = settings.get('personality', 'LUPIN_MD');
    
    let reply = \`*⚙️ BOT SETTINGS*\\n\\n*Name:* \${b}\\n*Prefix:* \${p}\\n*Suffix:* \${s}\\n*Personality:* \${pers}\\n*Owner:* +\${options.OWNER_NUMBER}\`;
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + reply });
`);

// 10. SETPREFIX
wrap('setprefix', ['prefix', 'cp'], 'settings', 'Changes the bot prefix', '.setprefix <symbol>', 'Owner', '🔑', {
    LUPIN_MD: "🕵️ The secret knock has been changed. Prefix updated.",
    SWIFTBOT: "⚡ Command trigger overridden. Prefix modification absolute.",
    BULL_MD: "🐂 The new rule is set. The prefix has been forged.",
    JOKER: "😂 New password? Don't forget this one! Prefix changed.",
    DODGE_MD: "🏎️ Ignition key changed. New prefix is ready.",
    KOE: "🌸 I will listen for this new gentle whisper now. Prefix updated.",
    BUNNY_MD: "🐰 Got it! I'll start listening for the new prefix now!",
    LUCIFER: "🌑 The dark sigil has been altered. Prefix changed.",
    ANGELS: "👼 The divine calling symbol has been gently updated.",
    ASTRA_X: "✨ The elegant command initiator has been seamlessly modified."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new prefix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ prefix: args[0] }, { merge: true });
    settings.set('prefix', args[0]);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Prefix updated to: \${args[0]}\` });
`);

// 11. SETSUFFIX
wrap('setsuffix', ['suffix', 'cs'], 'settings', 'Changes the bot suffix', '.setsuffix <text>', 'Owner', '🔑', {
    LUPIN_MD: "🕵️ The closing signature of our operations has been altered.",
    SWIFTBOT: "⚡ Trailing trigger overridden. Suffix modification absolute.",
    BULL_MD: "🐂 The final word is set. Suffix changed.",
    JOKER: "😂 Saving the best for last! Suffix updated.",
    DODGE_MD: "🏎️ Exhaust notes tuned. The new suffix is applied.",
    KOE: "🌸 The way our sentences end has changed... Suffix updated.",
    BUNNY_MD: "🐰 The tail end is now different! Suffix changed!",
    LUCIFER: "🌑 The closing shadow has shifted. Suffix altered.",
    ANGELS: "👼 The final graceful note has been updated.",
    ASTRA_X: "✨ The elegant command terminator has been seamlessly modified."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Please provide a new suffix." }); return; }
    await db.collection('bot_config').doc('command_settings').set({ suffix: args[0] }, { merge: true });
    settings.set('suffix', args[0]);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Suffix updated to: \${args[0]}\` });
`);

// 12. SETNAME
wrap('setname', ['botname', 'name'], 'settings', 'Changes the bot name', '.setname <name>', 'Owner', '📛', {
    LUPIN_MD: "🕵️ A new alias for a new heist. Name updated.",
    SWIFTBOT: "⚡ Designation overridden. New identification absolute.",
    BULL_MD: "🐂 The title of power has been declared. Name changed.",
    JOKER: "😂 New identity! Who am I today? Name updated!",
    DODGE_MD: "🏎️ Repainting the chassis. New title applied.",
    KOE: "🌸 You have given me a new identity... I will cherish it.",
    BUNNY_MD: "🐰 A shiny new name tag just for me! Yay!",
    LUCIFER: "🌑 The true name has been spoken and altered.",
    ANGELS: "👼 My divine title has been gently rebranded.",
    ASTRA_X: "✨ My elegant identity has been beautifully refreshed."
}, `
    if (args.length === 0) { await sock.sendMessage(chatId, { text: "❌ Please provide a new name." }); return; }
    const newName = args.join(' ');
    await db.collection('bot_config').doc('settings').set({ botname: newName }, { merge: true });
    settings.set('botname', newName);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Bot name updated to: \${newName}\` });
`);

// 13. SETIMAGE
wrap('setimage', ['botimage'], 'settings', 'Changes the bot image', '.setimage (reply to image)', 'Owner', '🖼️', {
    LUPIN_MD: "🕵️ The face of our operation is best managed securely from the shadows of the dashboard.",
    SWIFTBOT: "⚡ Visual override denied in chat. Utilize the web interface.",
    BULL_MD: "🐂 Visuals must be forged in the main dashboard panel.",
    JOKER: "😂 I'm camera shy here! Go use the dashboard for my new profile pic!",
    DODGE_MD: "🏎️ Paint job requires a pit stop at the web dashboard.",
    KOE: "🌸 Please use the beautiful dashboard to change my face gently.",
    BUNNY_MD: "🐰 Hop over to the dashboard to give me a new look!",
    LUCIFER: "🌑 My dark visage can only be altered from the web realm.",
    ANGELS: "👼 Please visit the heavenly dashboard to update my portrait.",
    ASTRA_X: "✨ For an elegant visual update, please utilize the web control panel."
}, `
    await sock.sendMessage(chatId, { text: (options.response || "") + "\\n\\n✅ Image update feature is managed via Dashboard/Web for safety." });
`);

// 14. PERSONALITY
wrap('personality', ['setpersonality', 'character'], 'settings', 'Changes active personality', '.personality <LUPIN_MD|SWIFTBOT|BULL_MD|JOKER|DODGE_MD|KOE|BUNNY_MD|LUCIFER|ANGELS|ASTRA_X>', 'Owner', '🎭', {
    LUPIN_MD: "🕵️ A new mask is worn. Personality parameters shifting.",
    SWIFTBOT: "⚡ Behavioral matrix overridden. New persona active.",
    BULL_MD: "🐂 The attitude has been hardened. Personality enforced.",
    JOKER: "😂 Time to put on a new face! Let's get crazy!",
    DODGE_MD: "🏎️ Switching driving modes! New personality engaged.",
    KOE: "🌸 My feelings have changed to match your desires...",
    BUNNY_MD: "🐰 Changing my mood! Ready to play in a new way!",
    LUCIFER: "🌑 The soul of the machine darkens to the requested persona.",
    ANGELS: "👼 My spirit has adapted to serve you with a new demeanor.",
    ASTRA_X: "✨ Elegant behavioral shift complete. New persona active."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Available: LUPIN_MD, SWIFTBOT, BULL_MD, JOKER, DODGE_MD, KOE, BUNNY_MD, LUCIFER, ANGELS, ASTRA_X" }); return; }
    const p = args[0].toUpperCase().replace('-', '_');
    await db.collection('bot_config').doc('settings').set({ personality: p }, { merge: true });
    settings.set('personality', p);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Personality updated to: \${p}\` });
`);

// 15. MODES
wrap('modes', ['botmode'], 'settings', 'Toggle prefixless or other modes', '.modes <prefix|prefixless>', 'Owner', '🎛️', {
    LUPIN_MD: "🕵️ The rules of engagement have been stealthily altered.",
    SWIFTBOT: "⚡ Operational mode overridden. System logic updated.",
    BULL_MD: "🐂 The battle rules are set. Mode enforced.",
    JOKER: "😂 Switching up the game! The mode has been flipped!",
    DODGE_MD: "🏎️ Shifting gears! New operational mode engaged.",
    KOE: "🌸 The way I listen to you has been gently changed...",
    BUNNY_MD: "🐰 Flipping the switches! New mode activated!",
    LUCIFER: "🌑 The dark laws of operation have shifted.",
    ANGELS: "👼 The peaceful laws of engagement have been updated.",
    ASTRA_X: "✨ The elegant interaction mode has been flawlessly applied."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a mode: prefix, prefixless, suffix, suffixless" }); return; }
    const mode = args[0].toLowerCase();
    await db.collection('bot_config').doc('command_settings').set({ mode: mode }, { merge: true });
    settings.set('mode', mode);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Bot mode updated to: \${mode}\` });
`);

// 16. BOXMODE
wrap('boxmode', ['box'], 'settings', 'Toggle box message styling', '.boxmode <on|off>', 'Owner', '📦', {
    LUPIN_MD: "🕵️ The structural disguise of our messages has been toggled.",
    SWIFTBOT: "⚡ Container formatting overridden. Box mode absolute.",
    BULL_MD: "🐂 The rigid structure is set. Box mode enforced.",
    JOKER: "😂 Thinking inside or outside the box? Mode toggled!",
    DODGE_MD: "🏎️ Chassis framing adjusted. Box mode engaged.",
    KOE: "🌸 I will shape my words as you requested...",
    BUNNY_MD: "🐰 Putting things neatly in a box! (Or taking them out!)",
    LUCIFER: "🌑 The dark borders of my words have been altered.",
    ANGELS: "👼 The beautiful framing of my messages is now updated.",
    ASTRA_X: "✨ The elegant structural presentation has been modified."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .boxmode on or off" }); return; }
    const val = args[0] === 'on';
    await db.collection('bot_config').doc('settings').set({ boxmode: val }, { merge: true });
    settings.set('boxmode', val);
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Boxmode \${val ? 'Enabled' : 'Disabled'}\` });
`);

// 17. MAINTENANCE
wrap('maintenance', ['mt'], 'settings', 'Toggle maintenance mode', '.maintenance <on|off>', 'Owner', '🚧', {
    LUPIN_MD: "🕵️ We are going dark. Maintenance protocols initiated.",
    SWIFTBOT: "⚡ System lockdown. Maintenance mode absolute.",
    BULL_MD: "🐂 The gates are closed. Maintenance enforced.",
    JOKER: "😂 Taking a coffee break! The bot is under construction.",
    DODGE_MD: "🏎️ Entering the pit stop. Maintenance engaged.",
    KOE: "🌸 I need some time to heal and rest. Maintenance active.",
    BUNNY_MD: "🐰 Time for a quick nap and some fixes! Maintenance mode on!",
    LUCIFER: "🌑 The abyss closes. Maintenance has begun.",
    ANGELS: "👼 The system is resting peacefully for divine upgrades.",
    ASTRA_X: "✨ Elegant system rest initiated. Maintenance active."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Usage: .maintenance on or off" }); return; }
    const val = args[0] === 'on' ? 'MAINTENANCE' : 'ACTIVE';
    await db.collection('bot_config').doc('settings').set({ status: val }, { merge: true });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Maintenance Mode is now \${val}\` });
`);

// 18. BLOCKCMD
wrap('blockcmd', ['disablecmd'], 'settings', 'Block a specific command', '.blockcmd <command>', 'Owner', '🚫', {
    LUPIN_MD: "🕵️ That tool has been confiscated. Command locked.",
    SWIFTBOT: "⚡ Execution denied. Command block absolute.",
    BULL_MD: "🐂 The path is sealed. Command blocked by force.",
    JOKER: "😂 Oops! Someone took that toy away! Command blocked.",
    DODGE_MD: "🏎️ Throwing a wrench in the gears. Command locked.",
    KOE: "🌸 I will no longer speak that word... it is blocked.",
    BUNNY_MD: "🐰 Putting that carrot away! Command disabled.",
    LUCIFER: "🌑 The dark seal has been placed. Command forbidden.",
    ANGELS: "👼 That action has been peacefully restricted.",
    ASTRA_X: "✨ Elegant restriction applied. Command is now disabled."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to block." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'blocked' });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Command '\${args[0]}' is now blocked.\` });
`);

// 19. UNBLOCKCMD
wrap('unblockcmd', ['enablecmd'], 'settings', 'Unblock a specific command', '.unblockcmd <command>', 'Owner', '✅', {
    LUPIN_MD: "🕵️ The tool is back in the arsenal. Command unlocked.",
    SWIFTBOT: "⚡ Execution restored. Command block lifted.",
    BULL_MD: "🐂 The gates are open again. Command unblocked.",
    JOKER: "😂 Here is your toy back! Command restored!",
    DODGE_MD: "🏎️ Removing the brakes! Command unlocked.",
    KOE: "🌸 I am free to speak that word once more...",
    BUNNY_MD: "🐰 Bringing the carrot back out! Command enabled!",
    LUCIFER: "🌑 The dark seal is broken. Command permitted.",
    ANGELS: "👼 The restriction has been gracefully lifted.",
    ASTRA_X: "✨ Elegant restoration complete. Command is now active."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Specify command to unblock." }); return; }
    const target = commandManager.findCommand(args[0], currentPrefix);
    if (!target) { await sock.sendMessage(chatId, { text: "❌ Command not found." }); return; }
    await db.collection('commands').doc(target.config.id).update({ status: 'enabled' });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Command '\${args[0]}' is now enabled.\` });
`);

// 20. ADDSUDO
wrap('addsudo', ['sudoadd'], 'settings', 'Add a sudo user', '.addsudo <number>', 'Owner', '👑', {
    LUPIN_MD: "🕵️ A new operative has been granted executive access.",
    SWIFTBOT: "⚡ Privilege escalation absolute. Sudo access granted.",
    BULL_MD: "🐂 A new commander joins the ranks. Sudo enforced.",
    JOKER: "😂 Look who just got the VIP pass! Sudo added.",
    DODGE_MD: "🏎️ Handing over the spare keys. Sudo access engaged.",
    KOE: "🌸 I will now listen deeply to this new person...",
    BUNNY_MD: "🐰 A new friend with special powers! Sudo added!",
    LUCIFER: "🌑 The dark pact expands. Sudo rights granted.",
    ANGELS: "👼 A new guardian has been peacefully appointed.",
    ASTRA_X: "✨ Elegant executive privileges have been flawlessly granted."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to add." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).set({ addedAt: new Date().toISOString() });
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Added \${num} to sudo users.\` });
`);

// 21. DELSUDO
wrap('delsudo', ['sudodel'], 'settings', 'Remove a sudo user', '.delsudo <number>', 'Owner', '👑', {
    LUPIN_MD: "🕵️ Executive access revoked. The operative is out.",
    SWIFTBOT: "⚡ Privilege demotion absolute. Sudo access removed.",
    BULL_MD: "🐂 The commander has been stripped of rank. Sudo removed.",
    JOKER: "😂 VIP pass expired! Back to the normal line! Sudo removed.",
    DODGE_MD: "🏎️ Taking back the spare keys. Sudo access revoked.",
    KOE: "🌸 I must say goodbye to their special whispers...",
    BUNNY_MD: "🐰 Taking away the magic wand! Sudo removed.",
    LUCIFER: "🌑 The dark pact is severed. Sudo rights revoked.",
    ANGELS: "👼 The guardian duties have been peacefully relieved.",
    ASTRA_X: "✨ Elegant executive privileges have been flawlessly revoked."
}, `
    if (!args[0]) { await sock.sendMessage(chatId, { text: "❌ Provide a number to remove." }); return; }
    const num = args[0].replace(/[^0-9]/g, '');
    await db.collection('SudoUsers').doc(num).delete();
    await sock.sendMessage(chatId, { text: (options.response ? options.response + "\\n\\n" : "") + \`✅ Removed \${num} from sudo users.\` });
`);

