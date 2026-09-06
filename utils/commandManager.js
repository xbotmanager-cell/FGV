import { db } from './firebaseAdmin.js';

class CommandManager {
    constructor() {
        this.commands = new Map();
        this.baseCommands = new Map();
        
        try {
            this.unsubscribe = db.collection('commands').onSnapshot((snapshot) => {
                this.commands.clear();
                snapshot.docs.forEach(doc => {
                    this.commands.set(doc.id, { id: doc.id, ...doc.data() });
                });
                console.log(`[INFO] 🔄 Loaded ${this.commands.size} advanced dynamic commands`);
            }, (error) => console.error('[CommandManager] Error listening to commands:', error.message));
        } catch (e) {
            console.error('[CommandManager] Setup failed:', e.message);
        }
    }

    async registerBaseCommand(command) {
        if (!command || !command.name) return;
        const originalName = command.name.toLowerCase();
        this.baseCommands.set(originalName, command);
        
        try {
            const doc = await db.collection('commands').doc(originalName).get();
            if (!doc.exists || !doc.data().responses) {
                await this.addCommand({
                    name: command.name,
                    aliases: command.aliases || [],
                    category: command.category || 'general',
                    description: command.description || '',
                    usage: command.usage || `.${command.name}`,
                    permission: command.permission || 'Public',
                    reaction: command.reaction || '✅',
                    enabled: command.enabled !== false,
                    responses: command.responses || {
                        LUPIN_MD: "Lupin response",
                        SWIFTBOT: "Swiftbot response",
                        BULL_MD: "Bull response",
                        JOKER: "Joker response",
                        DODGE_MD: "Dodge response",
                        KOE: "Koe response",
                        BUNNY_MD: "Bunny response",
                        LUCIFER: "Lucifer response",
                        ANGELS: "Angels response",
                        ASTRA_X: "Astra X response"
                    },
                    help: command.help || { overview: command.description, usage: `.${command.name}`, features: [] },
                    media: command.media || { type: "text", url: "", caption: "" },
                    logs: [],
                    version: 1
                }, 'System Initialization');
            }
        } catch (e) {
            console.error('Failed to register base command', command.name, e);
        }
    }

    async addCommand(data, user = 'System') {
        const id = data.name.toLowerCase();
        const payload = {
            ...data,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await db.collection('commands').doc(id).set(payload);
        await this.logChange(user, `Added command ${id}`);
        return id;
    }

    async updateCommand(id, updates, user = 'Owner') {
        const doc = await db.collection('commands').doc(id).get();
        if(!doc.exists) return;
        const currentVersion = doc.data().version || 1;
        await db.collection('commands').doc(id).update({
            ...updates,
            version: currentVersion + 1,
            updatedAt: new Date().toISOString(),
            updatedBy: user
        });
        await this.logChange(user, `Updated ${id}: ${Object.keys(updates).join(', ')}`);
    }

    findCommand(input, prefix = '.') {
        const textMsg = input.trim();
        let commandName = '';
        let args = [];
        
        const splitIdx = textMsg.indexOf(' ');
        const firstWord = splitIdx === -1 ? textMsg : textMsg.substring(0, splitIdx);
        const rest = splitIdx === -1 ? '' : textMsg.substring(splitIdx + 1);
        
        if (firstWord.startsWith(prefix)) {
            commandName = firstWord.slice(prefix.length).toLowerCase();
        } else {
            commandName = firstWord.toLowerCase();
        }
        
        args = rest ? rest.split(/\s+/) : [];
        if (!commandName) return null;

        let foundConfig = null;
        if (this.commands.has(commandName)) {
            foundConfig = this.commands.get(commandName);
        } else {
            for (const [id, cmd] of this.commands.entries()) {
                if (cmd.aliases && cmd.aliases.includes(commandName)) {
                    foundConfig = cmd;
                    break;
                }
            }
        }

        if (foundConfig) {
            const baseCommand = this.baseCommands.get(foundConfig.id);
            return {
                config: foundConfig,
                execute: baseCommand ? baseCommand.execute : null,
                commandName,
                args
            };
        }
        return null;
    }

    async logChange(user, action) {
        await db.collection('command_logs').add({
            user,
            action,
            timestamp: new Date().toISOString()
        });
    }
}

export const commandManager = new CommandManager();
