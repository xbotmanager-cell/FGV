import { db } from './firebaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';
import { modesEngine } from './modesEngine.js';
import { lockSystem } from './lockSystem.js';

class CommandManager {
    constructor() {
        this.commands = new Map(); // Fast in-memory cache
        this.mode = 'prefix'; // 'prefix', 'prefixless', 'suffix', 'suffixless'
        this.prefix = '.';
        this.suffix = '.bot';
        this.baseCommands = new Map(); // Store native command executions
        
        // Listen to Firestore real-time updates
        try {
            this.unsubscribe = db.collection('commands').onSnapshot((snapshot) => {
                this.commands.clear();
                snapshot.forEach(doc => {
                    const data = { id: doc.id, ...doc.data() };
                    this.commands.set(doc.id, data);
                });
                console.log(`[INFO] 🔄 Loaded ${this.commands.size} dynamic commands`);
            }, (error) => console.error('[CommandManager] Error listening to commands:', error.message));

            // Load config
            db.collection('bot_config').doc('command_settings').onSnapshot(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    this.mode = data.mode || this.mode;
                    this.prefix = data.prefix || this.prefix;
                    this.suffix = data.suffix || this.suffix;
                }
            }, (error) => console.error('[CommandManager] Error listening to config:', error.message));
        } catch (e) {
            console.error('[CommandManager] Setup failed:', e.message);
        }
    }

    // Register original command logic
    registerBaseCommand(command) {
        if (!command || !command.name) return;
        
        const originalName = command.name.toLowerCase();
        this.baseCommands.set(originalName, command);
        
        // Ensure it exists in Firestore if not already there
        db.collection('commands').doc(originalName).get().then(doc => {
            if (!doc.exists) {
                this.addCommand({
                    currentName: originalName,
                    originalName: originalName,
                    description: command.description || '',
                    category: command.category || 'general',
                    status: 'enabled',
                    aliases: command.alias || [],
                    permissions: command.ownerOnly ? 'owner' : 'user'
                });
            }
        });
    }

    async addCommand(data) {
        const id = data.currentName.toLowerCase();
        await db.collection('commands').doc(id).set({
            ...data,
            id,
            originalName: data.originalName || data.currentName,
            status: data.status || 'enabled',
            aliases: data.aliases || [],
            createdAt: new Date().toISOString()
        });
        await this.logChange('System', `Added command ${id}`);
        return id;
    }

    async updateCommand(id, updates, user = 'System') {
        await db.collection('commands').doc(id).update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
        await this.logChange(user, `Updated ${id}: ${Object.keys(updates).join(', ')}`);
    }

    async renameCommand(oldId, newName, user = 'Owner') {
        const docRef = db.collection('commands').doc(oldId);
        const doc = await docRef.get();
        if (!doc.exists) return false;
        
        const data = doc.data();
        const newId = newName.toLowerCase();
        
        // Create new doc, delete old
        await db.collection('commands').doc(newId).set({
            ...data,
            currentName: newId,
            id: newId,
            updatedAt: new Date().toISOString()
        });
        
        await docRef.delete();
        await this.logChange(user, `Renamed ${oldId} to ${newId}`);
        return true;
    }

    async restoreCommand(id, user = 'Owner') {
        let targetId = id;
        let command = this.commands.get(targetId);
        
        if (!command) {
            // Find by original name
            for (const [key, cmd] of this.commands.entries()) {
                if (cmd.originalName === id) {
                    targetId = key;
                    command = cmd;
                    break;
                }
            }
        }
        
        if (command && command.currentName !== command.originalName) {
            await this.renameCommand(targetId, command.originalName, user);
            return true;
        }
        return false;
    }

    async addAlias(id, alias, user = 'Owner') {
        const command = this.commands.get(id);
        if (!command) return false;
        
        const aliases = new Set(command.aliases || []);
        aliases.add(alias);
        await this.updateCommand(id, { aliases: Array.from(aliases) });
        await this.logChange(user, `Added alias ${alias} to ${id}`);
        return true;
    }

    findCommand(input, userId = null) {
        const parsed = this.parseInput(input, userId);
        if (!parsed.commandName) return null;

        const { commandName } = parsed;

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
            const lockCheck = lockSystem.isLocked('command', foundConfig.originalName);
            const baseCommand = this.baseCommands.get(foundConfig.originalName);
            return {
                config: foundConfig,
                execute: baseCommand ? baseCommand.execute : null,
                isLocked: lockCheck.locked,
                lockReason: lockCheck.reason,
                ...parsed
            };
        }

        return null;
    }

    parseInput(textMsg, userId = null) {
        textMsg = textMsg.trim();
        
        // Dynamic command matching logic from modesEngine
        // But for compatibility with existing commandManager code, we parse it here using the new engine's logic.
        
        const splitIdx = textMsg.indexOf(' ');
        const firstWord = splitIdx === -1 ? textMsg : textMsg.substring(0, splitIdx);
        const rest = splitIdx === -1 ? '' : textMsg.substring(splitIdx + 1);
        const splitArgs = rest ? rest.split(/\s+/) : [];

        // Check if modesEngine is loaded, else fallback
        let mode = 'PREFIX';
        let prefix = '.';
        let suffix = '.bot';

        try {
            const format = modesEngine.cache?.messageFormat || modesEngine.defaults?.messageFormat;
            
            // Apply Personal Bot Mode overrides if available
            let userFormat = format;
            if (userId && modesEngine.cache?.userConfigs?.has(userId)) {
                const userConfig = modesEngine.cache.userConfigs.get(userId);
                if (userConfig && userConfig.messageFormat) {
                    userFormat = userConfig.messageFormat;
                }
            }

            if (userFormat) {
                mode = userFormat.mode || mode;
                prefix = userFormat.prefix || prefix;
                suffix = userFormat.suffix || suffix;
            }
        } catch (e) {
            // Fallback if modes engine not ready
        }

        let commandName = '';
        let args = splitArgs;

        if (mode === 'PREFIX' && textMsg.startsWith(prefix)) {
            const parsedName = firstWord.slice(prefix.length).toLowerCase();
            commandName = parsedName;
        } else if (mode === 'PREFIXLESS') {
            commandName = firstWord.toLowerCase();
        } else if (mode === 'SUFFIX' && firstWord.toLowerCase().endsWith(suffix)) {
            commandName = firstWord.slice(0, -suffix.length).toLowerCase();
        } else if (mode === 'SUFFIXLESS') {
            commandName = firstWord.toLowerCase();
        } else {
             // Fallback for previous code defaults
             if (this.mode === 'prefix' && textMsg.startsWith(this.prefix)) {
                 commandName = firstWord.slice(this.prefix.length).toLowerCase();
             } else if (this.mode === 'prefixless') {
                 commandName = firstWord.toLowerCase();
             }
        }

        return { commandName, args };
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
