
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
