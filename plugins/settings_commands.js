import { commandManager } from '../utils/commandManager.js';
import { db } from '../utils/firebaseAdmin.js';
import { personalityEngine } from '../utils/engines/personalityEngine.js';
import { boxStyleEngine } from '../utils/engines/boxStyleEngine.js';

export default function registerSettingsCommands() {
    
    commandManager.registerBaseCommand({
        name: 'settings',
        alias: ['setting', 'config'],
        description: 'Display current bot configuration',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const doc = await db.collection('bot_config').doc('settings').get();
            const modesDoc = await db.collection('bot_config').doc('modes').get();
            const data = doc.exists ? doc.data() : {};
            const m = modesDoc.exists ? modesDoc.data() : {};
            
            const txt = boxStyleEngine.format('BOT SETTINGS', [
                `Name: ${data.name || 'Bot'}`,
                `Personality: ${personalityEngine.currentPersonality}`,
                `Prefix: ${data.prefix || '.'}`,
                `Suffix: ${data.suffix || '.bot'}`,
                `Box Mode: ${m.box ? 'ON' : 'OFF'}`,
                `Language: ${data.language || 'en'}`,
                ``,
                `--- MODES ---`,
                `Owner Mode: ${m.owner ? 'ON' : 'OFF'}`,
                `Sudo Mode: ${m.sudo ? 'ON' : 'OFF'}`,
                `Group Mode: ${m.group ? 'ON' : 'OFF'}`,
                `DM Mode: ${m.dm ? 'ON' : 'OFF'}`,
                `Prefix Mode: ${m.prefix ? 'ON' : 'OFF'}`,
                `Suffix Mode: ${m.suffix ? 'ON' : 'OFF'}`,
                `Maintenance: ${m.maintenance ? 'ON' : 'OFF'}`
            ]);
            await sock.sendMessage(chatId, { text: txt });
        }
    });

    commandManager.registerBaseCommand({
        name: 'setprefix',
        description: 'Change command prefix',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const newPrefix = args[0];
            if (!newPrefix) return await sock.sendMessage(chatId, { text: "Usage: .setprefix <prefix>" });
            
            await db.collection('bot_config').doc('settings').set({ prefix: newPrefix }, { merge: true });
            await db.collection('bot_config').doc('command_settings').set({ prefix: newPrefix }, { merge: true });
            
            await sock.sendMessage(chatId, { text: `✅ Prefix updated to: ${newPrefix}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'setsuffix',
        description: 'Change command suffix',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const newSuffix = args[0];
            if (!newSuffix) return await sock.sendMessage(chatId, { text: "Usage: .setsuffix <suffix>" });
            
            await db.collection('bot_config').doc('settings').set({ suffix: newSuffix }, { merge: true });
            await db.collection('bot_config').doc('command_settings').set({ suffix: newSuffix }, { merge: true });
            
            await sock.sendMessage(chatId, { text: `✅ Suffix updated to: ${newSuffix}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'prefixmode',
        description: 'Enable or disable prefix requirement',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const state = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(state)) return await sock.sendMessage(chatId, { text: "Usage: .prefixmode <on|off>" });
            
            await db.collection('bot_config').doc('modes').set({ prefix: state === 'on' }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Prefix mode set to ${state.toUpperCase()}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'suffixmode',
        description: 'Enable or disable suffix commands',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const state = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(state)) return await sock.sendMessage(chatId, { text: "Usage: .suffixmode <on|off>" });
            
            await db.collection('bot_config').doc('modes').set({ suffix: state === 'on' }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Suffix mode set to ${state.toUpperCase()}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'boxmode',
        description: 'Controls message box formatting',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const state = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(state)) return await sock.sendMessage(chatId, { text: "Usage: .boxmode <on|off>" });
            
            await db.collection('bot_config').doc('modes').set({ box: state === 'on' }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Box mode set to ${state.toUpperCase()}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'personality',
        description: 'Changes active personality',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const newP = args.join(' ').toUpperCase();
            
            if (!newP) {
                const list = Array.from(personalityEngine.personalities.keys()).join(', ');
                return await sock.sendMessage(chatId, { text: `Usage: .personality <name>\nAvailable: ${list}` });
            }
            
            if (!personalityEngine.personalities.has(newP)) {
                return await sock.sendMessage(chatId, { text: `❌ Personality not found. Available: ${Array.from(personalityEngine.personalities.keys()).join(', ')}` });
            }
            
            personalityEngine.setPersonality(newP);
            await sock.sendMessage(chatId, { text: `✅ Personality updated to: ${newP}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'setname',
        description: 'Changes bot display name',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const name = args.join(' ');
            if (!name) return await sock.sendMessage(chatId, { text: "Usage: .setname <name>" });
            
            await db.collection('bot_config').doc('settings').set({ name }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Bot name updated to: ${name}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'setimage',
        description: 'Changes profile image URL',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const url = args[0];
            if (!url || !url.startsWith('http')) return await sock.sendMessage(chatId, { text: "Usage: .setimage <http-url>" });
            
            await db.collection('bot_config').doc('settings').set({ profileImage: url }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Bot profile image updated.` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'language',
        description: 'Change bot language',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const lang = args[0]?.toLowerCase();
            
            const doc = await db.collection('bot_config').doc('settings').get();
            const currLang = doc.exists ? (doc.data().language || 'en') : 'en';
            
            if (!lang) return await sock.sendMessage(chatId, { text: `Current language: ${currLang}\nUsage: .language <code e.g. en, es>` });
            
            await db.collection('bot_config').doc('settings').set({ language: lang }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Language updated to: ${lang}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'modes',
        description: 'Manage bot modes',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const mode = args[0]?.toLowerCase();
            const state = args[1]?.toLowerCase();

            if (!mode || !['on', 'off'].includes(state)) {
                const doc = await db.collection('bot_config').doc('modes').get();
                const m = doc.exists ? doc.data() : {};
                const list = Object.entries(m).map(([k, v]) => `${k}: ${v ? 'ON' : 'OFF'}`);
                return await sock.sendMessage(chatId, { text: boxStyleEngine.format('MODES', list) });
            }

            const isValidMode = ['owner', 'sudo', 'group', 'dm', 'maintenance', 'public', 'prefix', 'prefixless', 'suffix', 'box'].includes(mode);
            if (!isValidMode) return await sock.sendMessage(chatId, { text: "❌ Invalid mode." });

            await db.collection('bot_config').doc('modes').set({ [mode]: state === 'on' }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Mode ${mode} set to ${state.toUpperCase()}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'maintenance',
        description: 'Toggle maintenance mode',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const state = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(state)) return await sock.sendMessage(chatId, { text: "Usage: .maintenance <on|off>" });
            
            await db.collection('bot_config').doc('modes').set({ maintenance: state === 'on' }, { merge: true });
            await sock.sendMessage(chatId, { text: `✅ Maintenance mode set to ${state.toUpperCase()}` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'addsudo',
        description: 'Add a sudo user',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const num = args[0];
            if (!num) return await sock.sendMessage(chatId, { text: "Usage: .addsudo <number>" });
            
            const docRef = db.collection('bot_config').doc('sudo');
            const doc = await docRef.get();
            const data = doc.exists ? doc.data() : { users: [] };
            if (!data.users) data.users = [];
            if (!data.users.includes(num)) {
                data.users.push(num);
                await docRef.set(data, { merge: true });
            }
            await sock.sendMessage(chatId, { text: `✅ Added ${num} to sudo list.` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'delsudo',
        description: 'Remove a sudo user',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const num = args[0];
            if (!num) return await sock.sendMessage(chatId, { text: "Usage: .delsudo <number>" });
            
            const docRef = db.collection('bot_config').doc('sudo');
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                data.users = (data.users || []).filter(u => u !== num);
                await docRef.set(data, { merge: true });
            }
            await sock.sendMessage(chatId, { text: `✅ Removed ${num} from sudo list.` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'listsudo',
        description: 'List sudo users',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const doc = await db.collection('bot_config').doc('sudo').get();
            const users = doc.exists ? (doc.data().users || []) : [];
            await sock.sendMessage(chatId, { text: boxStyleEngine.format('SUDO USERS', users.length ? users : ['No sudo users']) });
        }
    });

    commandManager.registerBaseCommand({
        name: 'bansudo',
        description: 'Ban a sudo user',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const num = args[0];
            if (!num) return await sock.sendMessage(chatId, { text: "Usage: .bansudo <number>" });
            const docRef = db.collection('bot_config').doc('sudo');
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                data.users = (data.users || []).filter(u => u !== num);
                data.banned = data.banned || [];
                if (!data.banned.includes(num)) data.banned.push(num);
                await docRef.set(data, { merge: true });
            }
            await sock.sendMessage(chatId, { text: `✅ Banned ${num} from sudo.` });
        }
    });

    commandManager.registerBaseCommand({
        name: 'blockcmd',
        alias: ['block'],
        description: 'Disable selected command',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const cmdToBlock = args[0]?.toLowerCase();
            const reason = args.slice(1).join(' ') || 'Admin decision';
            
            if (!cmdToBlock) return await sock.sendMessage(chatId, { text: "Usage: .blockcmd <command> [reason]" });

            await db.collection('commands').doc(cmdToBlock).set({
                status: 'blocked',
                blockReason: reason,
                blockedAt: new Date().toISOString()
            }, { merge: true });

            await sock.sendMessage(chatId, { text: boxStyleEngine.format('SYSTEM LOCK', [`Command: ${cmdToBlock}`, `Status: BLOCKED`, `Reason: ${reason}`]) });
        }
    });

    commandManager.registerBaseCommand({
        name: 'unblockcmd',
        alias: ['unblock'],
        description: 'Restore command',
        category: 'settings',
        ownerOnly: true,
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const cmdToUnblock = args[0]?.toLowerCase();
            
            if (!cmdToUnblock) return await sock.sendMessage(chatId, { text: "Usage: .unblockcmd <command>" });

            await db.collection('commands').doc(cmdToUnblock).set({
                status: 'enabled',
                blockReason: null
            }, { merge: true });

            await sock.sendMessage(chatId, { text: boxStyleEngine.format('SYSTEM UNLOCK', [`Command ${cmdToUnblock} restored.`]) });
        }
    });
}
