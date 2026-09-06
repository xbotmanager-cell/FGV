import fs from 'fs';
import path from 'path';

const dirs = ['settings', 'general', 'admin', 'developer'];
dirs.forEach(d => {
    const p = path.join('plugins', d);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

fs.writeFileSync('plugins/general/ping.js', `
export default {
    name: 'ping',
    description: 'Check bot response speed',
    category: 'general',
    ownerOnly: false,
    execute: async (sock, msg, args) => {
        const chatId = msg.key.remoteJid;
        const start = Date.now();
        await sock.sendMessage(chatId, { text: 'Pinging...' }).then(async () => {
            const end = Date.now();
            await sock.sendMessage(chatId, { text: \`Pong! Speed: \${end - start}ms\` });
        });
    }
};
`);

fs.writeFileSync('plugins/general/help.js', `
export default {
    name: 'help',
    description: 'Show details about commands',
    category: 'general',
    ownerOnly: false,
    execute: async (sock, msg, args) => {
        const chatId = msg.key.remoteJid;
        await sock.sendMessage(chatId, { text: "Use the web dashboard to see all commands." });
    }
};
`);

fs.writeFileSync('plugins/admin/block.js', `
export default {
    name: 'block',
    description: 'Block a user',
    category: 'admin',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const chatId = msg.key.remoteJid;
        await sock.sendMessage(chatId, { text: "User blocked." });
    }
};
`);

