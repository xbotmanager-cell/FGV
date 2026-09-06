import { commandManager } from '../utils/commandManager.js';
import { db } from '../utils/firebaseAdmin.js';
import { personalityEngine } from '../utils/engines/personalityEngine.js';
import { boxStyleEngine } from '../utils/engines/boxStyleEngine.js';

const START_TIME = Date.now();

export default function registerGeneralCommands() {
    
    // 1. MENU COMMAND
    commandManager.registerBaseCommand({
        name: 'menu',
        description: 'Show available commands',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            
            // Check box mode
            const modesDoc = await db.collection('bot_config').doc('modes').get();
            const boxMode = modesDoc.exists && modesDoc.data().box;
            
            // Group commands by category
            const categories = {};
            for (const [id, cmd] of commandManager.commands.entries()) {
                if (cmd.status !== 'enabled') continue;
                const cat = cmd.category || 'general';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(cmd.currentName);
            }
            
            let outLines = [];
            outLines.push(`Personality: ${personalityEngine.currentPersonality}`);
            outLines.push(``);
            
            for (const [cat, cmds] of Object.entries(categories)) {
                outLines.push(`[ ${cat.toUpperCase()} ]`);
                outLines.push(cmds.map(c => `• ${c}`).join('\n'));
                outLines.push(``);
            }
            
            const greeting = personalityEngine.getResponse('greeting');
            outLines.unshift(greeting, '');

            if (boxMode) {
                await sock.sendMessage(chatId, { text: boxStyleEngine.format('MAIN MENU', outLines) });
            } else {
                await sock.sendMessage(chatId, { text: `*MAIN MENU*\n\n${outLines.join('\n')}` });
            }
        }
    });

    // 2. HELP COMMAND
    commandManager.registerBaseCommand({
        name: 'help',
        description: 'Show details about a command',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const cmdName = args[0]?.toLowerCase();
            
            if (!cmdName) return await sock.sendMessage(chatId, { text: "Usage: .help <command>" });
            
            const found = commandManager.commands.get(cmdName) || Array.from(commandManager.commands.values()).find(c => c.aliases && c.aliases.includes(cmdName));
            if (!found) return await sock.sendMessage(chatId, { text: personalityEngine.getResponse('unknown') });
            
            const lines = [
                `Command: ${found.currentName}`,
                `Description: ${found.description || 'No description'}`,
                `Aliases: ${found.aliases ? found.aliases.join(', ') : 'None'}`,
                `Category: ${found.category || 'general'}`,
                `Permissions: ${found.permissions || 'user'}`,
                `Status: ${found.status}`
            ];
            
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('COMMAND HELP', lines) });
        }
    });

    // 3. PING COMMAND
    commandManager.registerBaseCommand({
        name: 'ping',
        description: 'Check bot response speed',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const start = Date.now();
            await sock.sendMessage(chatId, { text: 'Pinging...' }).then(async (sentMsg) => {
                const end = Date.now();
                const diff = end - start;
                const p = personalityEngine.getResponse('success');
                await sock.sendMessage(chatId, { text: boxStyleEngine.format('PONG', [`${p}`, `Speed: ${diff}ms`]) });
            });
        }
    });

    // 4. BOT INFO COMMAND
    commandManager.registerBaseCommand({
        name: 'botinfo',
        description: 'Show bot information',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const doc = await db.collection('bot_config').doc('settings').get();
            const data = doc.exists ? doc.data() : {};
            
            const lines = [
                `Name: ${data.name || 'Bot'}`,
                `Version: 1.0.0`,
                `Commands: ${commandManager.commands.size}`,
                `Personality: ${personalityEngine.currentPersonality}`,
                `Owner: Admin`
            ];
            
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('BOT INFO', lines) });
        }
    });

    // 5. OWNER COMMAND
    commandManager.registerBaseCommand({
        name: 'owner',
        description: 'Show owner contact',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('OWNER', ['Contact the bot owner for support.']) });
        }
    });

    // 6. PROFILE COMMAND
    commandManager.registerBaseCommand({
        name: 'profile',
        description: 'Show user profile',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;
            
            const lines = [
                `ID: ${sender.split('@')[0]}`,
                `Status: Active User`
            ];
            
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('PROFILE', lines) });
        }
    });

    // 7. TIME COMMAND
    commandManager.registerBaseCommand({
        name: 'time',
        description: 'Show current time',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const now = new Date().toLocaleString();
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('TIME', [`Server Time:`, `${now}`]) });
        }
    });

    // 8. UPTIME COMMAND
    commandManager.registerBaseCommand({
        name: 'uptime',
        description: 'Show bot uptime',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const diff = Date.now() - START_TIME;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / 1000 / 60) % 60);
            const secs = Math.floor((diff / 1000) % 60);
            
            const lines = [`${days}d ${hours}h ${mins}m ${secs}s`];
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('UPTIME', lines) });
        }
    });

    // 9. VERSION COMMAND
    commandManager.registerBaseCommand({
        name: 'version',
        description: 'Show bot version',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('VERSION', [`Core: v1.0.0`, `Engine: NextGen-WhatsApp`]) });
        }
    });

    // 10. REPORT COMMAND
    commandManager.registerBaseCommand({
        name: 'report',
        description: 'Report a bug or suggestion',
        category: 'general',
        ownerOnly: false,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const report = args.join(' ');
            
            if (!report) return await sock.sendMessage(chatId, { text: "Usage: .report <message>" });
            
            const sender = msg.key.participant || msg.key.remoteJid;
            
            await db.collection('reports').add({
                sender,
                report,
                timestamp: new Date().toISOString()
            });
            
            const p = personalityEngine.getResponse('success');
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('REPORT SENT', [`${p}`, `Thank you for your feedback.`]) });
        }
    });
}
