import { commandManager } from '../../utils/commandManager.js';
import settings from '../../utils/settings.js';
import { db } from '../../utils/firebaseAdmin.js';
import os from 'os';

export default {
    name: "ping",
    aliases: ["speed","latency"],
    category: "general",
    permission: "Public",
    reaction: "⚡",
    description: "Shows bot response speed",
    help: {
        overview: "Shows bot response speed",
        usage: ".ping",
        features: ["Fully dynamic and customizable"]
    },
    responses: {
        "LUPIN_MD": "🕵️ I have silently penetrated the network. The vault's echo returned in {ms}ms.",
        "SWIFTBOT": "⚡ Network scan absolute. Zero delays detected. Connection speed: {ms}ms.",
        "BULL_MD": "🐂 Stand strong. The connection is unbreakable at {ms}ms.",
        "JOKER": "😂 Ping Pong! I hit the ball and it bounced back in exactly {ms}ms!",
        "DODGE_MD": "🏎️ Vroom! Engine revved to max RPM. Reached the server in {ms}ms!",
        "KOE": "🌸 I felt the connection pulse... my heartbeat reached you in {ms}ms.",
        "BUNNY_MD": "🐰 Hop hop! I bounced to the server and back in just {ms}ms!",
        "LUCIFER": "🌑 The shadows whisper the connection speed... {ms}ms.",
        "ANGELS": "👼 Blessings! The connection is peaceful and healthy at {ms}ms.",
        "ASTRA_X": "✨ System diagnostics complete. Network latency is a beautiful {ms}ms."
},
    execute: async (sock, msg, args, currentPrefix, options) => {
        const chatId = msg.key.remoteJid;
        try {
            
    const msgTime = msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now();
    const ms = Date.now() - msgTime;
    let reply = (options.response || "").replace(/{ms}/g, ms);
    if (!reply.includes(ms.toString())) reply += `\n\nSpeed: ${ms}ms`;
    await sock.sendMessage(chatId, { text: reply });

        } catch (e) {
            console.error(`[${"ping"}] Error:`, e.message);
        }
    }
};
