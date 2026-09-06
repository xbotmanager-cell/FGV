import fs from 'fs';
import path from 'path';

const dirs = ['settings', 'general', 'admin', 'developer', 'media'];
dirs.forEach(d => {
    const p = path.join('plugins', d);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const generateCommandFile = (category, cmd, aliases, desc, perm) => {
    const content = `export default {
    name: '${cmd}',
    aliases: ${JSON.stringify(aliases)},
    category: '${category}',
    description: '${desc}',
    usage: '.${cmd}',
    permission: '${perm}', // Public, Owner, Sudo, Admin
    reaction: '⚡',
    responses: {
        LUPIN_MD: "LUPIN ⚡: Target executed.",
        SWIFTBOT: "SWIFTBOT 🏎️: Done.",
        BULL_MD: "BULL 🐂: Authorized. Command complete.",
        JOKER: "JOKER 🃏: Hahaha! Okay, done!",
        DODGE_MD: "DODGE 🏎️: Zoom! Done.",
        KOE: "KŌE 🌸: Okay, I have done it for you.",
        BUNNY_MD: "BUNNY 🐰: Done and done! Hop hop!",
        LUCIFER: "LUCIFER 🦇: It is done.",
        ANGELS: "ANGELS 👼: Happy to help! All done.",
        ASTRA_X: "ASTRA 💫: Operation successful."
    },
    help: {
        overview: '${desc}',
        usage: '.${cmd}',
        features: ['Executes the command safely.']
    },
    media: { type: 'text', url: '', caption: '' },
    execute: async (sock, msg, args, currentPrefix, options) => {
        // Base logic to be injected or used via config
        const chatId = msg.key.remoteJid;
        try {
            await sock.sendMessage(chatId, { text: options.response || "Command executed." });
        } catch (e) { }
    }
};
`;
    fs.writeFileSync(path.join('plugins', category, `${cmd}.js`), content);
};

const settingsCmds = ['settings', 'setprefix', 'setsuffix', 'setname', 'setimage', 'personality', 'language', 'modes', 'boxmode', 'maintenance', 'addsudo', 'delsudo', 'blockcmd', 'unblockcmd'];
settingsCmds.forEach(c => generateCommandFile('settings', c, [], 'Manage bot settings.', 'Owner'));

const generalCmds = ['menu', 'help', 'ping', 'botinfo', 'owner', 'profile', 'uptime', 'version', 'time', 'report'];
generalCmds.forEach(c => generateCommandFile('general', c, [], 'General bot command.', 'Public'));

console.log("Plugins generated.");
