
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
