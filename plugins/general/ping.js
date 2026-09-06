
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
            await sock.sendMessage(chatId, { text: `Pong! Speed: ${end - start}ms` });
        });
    }
};
