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
        "LUPIN_MD": "LUPIN ⚡: Network penetration complete. Latency: {ms}ms.",
        "SWIFTBOT": "SWIFTBOT 🏎️: Boom! {ms}ms. Fast as always.",
        "BULL_MD": "BULL 🐂: Authorized. Connection stable at {ms}ms.",
        "JOKER": "JOKER 🃏: Hahaha! Ping Pong! Took me {ms}ms!",
        "DODGE_MD": "DODGE 🏎️: Vroom! Engine revved in {ms}ms.",
        "KOE": "KŌE 🌸: Hello... I reached you in {ms}ms.",
        "BUNNY_MD": "BUNNY 🐰: Hop hop! Bounced back in {ms}ms!",
        "LUCIFER": "LUCIFER 🦇: I have answered... {ms}ms.",
        "ANGELS": "ANGELS 👼: Greetings! Connection healthy at {ms}ms.",
        "ASTRA_X": "ASTRA 💫: Diagnostics complete. Response time {ms}ms."
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
