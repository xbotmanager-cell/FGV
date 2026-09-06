import { db } from './firebaseAdmin.js';

// Collection references
const MODES_COLL = 'Modes';
const BOTS_COLL = 'Bots';
const USERS_COLL = 'Users';
const CONFIG_COLL = 'Configurations';
const PERSONALITIES_COLL = 'Personalities';

/**
 * Modes Engine - Manages all dynamically configurable bot modes.
 */
class ModesEngine {
    constructor() {
        this.cache = {
            messageFormat: null,
            botAccess: null,
            personality: null,
            personalitiesList: [],
            userConfigs: new Map(), // phone number -> config
            deployment: null
        };
        
        // Default base configurations
        this.defaults = {
            messageFormat: {
                mode: 'PREFIX', // PREFIX, PREFIXLESS, SUFFIX, SUFFIXLESS, BOX, NO_BOX
                prefix: '.',
                suffix: '.bot',
                boxTemplate: '╭━━━〔 BOT MENU 〕━━━╮\n┃ {content}\n╰━━━━━━━━━━━━━━╯'
            },
            botAccess: {
                mode: 'PUBLIC', // PUBLIC, OWNER_ONLY, OWNER_SUDO, GROUP, DM, GROUP_DM, MAINTENANCE
                sudoUsers: [],
                maintenanceMessage: 'The bot is currently undergoing maintenance. Please try again later.'
            },
            personality: {
                mode: 'SINGLE', // SINGLE, MULTI
                activePersonalityId: 'default'
            },
            deployment: {
                mode: 'DEFAULT', // DEFAULT, SAAS
                expiryDate: null,
                isBlocked: false
            }
        };

        this.initialized = false;
        this.botId = process.env.BOT_ID || 'default_bot';
    }

    async init() {
        try {
            await this.loadConfigurations();
            this.setupListeners();
            await this.ensureDefaultPersonalities();
            this.initialized = true;
            console.log(`[Modes Engine] Initialized successfully for bot ${this.botId}`);
        } catch (error) {
            console.error('[Modes Engine] Initialization failed:', error);
        }
    }

    async loadConfigurations() {
        const configDoc = await db.collection(CONFIG_COLL).doc(this.botId).get();
        if (configDoc.exists) {
            const data = configDoc.data();
            this.cache.messageFormat = data.messageFormat || this.defaults.messageFormat;
            this.cache.botAccess = data.botAccess || this.defaults.botAccess;
            this.cache.personality = data.personality || this.defaults.personality;
            this.cache.deployment = data.deployment || this.defaults.deployment;
        } else {
            // Save defaults
            await this.saveConfigurations();
        }

        // Load personalities
        const personalitiesSnap = await db.collection(PERSONALITIES_COLL).get();
        if (!personalitiesSnap.empty) {
            this.cache.personalitiesList = personalitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    }

    setupListeners() {
        // Real-time updates for instant application without restart
        try {
            db.collection(CONFIG_COLL).doc(this.botId).onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    this.cache.messageFormat = data.messageFormat || this.defaults.messageFormat;
                    this.cache.botAccess = data.botAccess || this.defaults.botAccess;
                    this.cache.personality = data.personality || this.defaults.personality;
                    this.cache.deployment = data.deployment || this.defaults.deployment;
                    console.log(`[Modes Engine] Configuration updated dynamically.`);
                }
            }, (error) => {
                console.error(`[Modes Engine] Error listening to config:`, error.message);
            });

            db.collection(PERSONALITIES_COLL).onSnapshot((snap) => {
                if (!snap.empty) {
                    this.cache.personalitiesList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log(`[Modes Engine] Personalities updated dynamically.`);
                }
            }, (error) => {
                console.error(`[Modes Engine] Error listening to personalities:`, error.message);
            });
        } catch (e) {
            console.error('[Modes Engine] Listeners setup failed:', e.message);
        }
    }

    async saveConfigurations() {
        const payload = {
            messageFormat: this.cache.messageFormat || this.defaults.messageFormat,
            botAccess: this.cache.botAccess || this.defaults.botAccess,
            personality: this.cache.personality || this.defaults.personality,
            deployment: this.cache.deployment || this.defaults.deployment,
            updatedAt: new Date().toISOString()
        };
        await db.collection(CONFIG_COLL).doc(this.botId).set(payload, { merge: true });
    }

    async ensureDefaultPersonalities() {
        const personalities = [
            {
                id: 'default',
                name: 'Friendly AI',
                bio: 'I am a friendly and helpful AI assistant.',
                replyStyle: 'friendly and polite',
                mood: 'happy'
            },
            {
                id: 'professional',
                name: 'Professional Assistant',
                bio: 'A strict, professional and formal assistant.',
                replyStyle: 'formal, concise, direct',
                mood: 'serious'
            },
            {
                id: 'funny',
                name: 'Funny Bot',
                bio: 'I love cracking jokes while helping you out!',
                replyStyle: 'humorous, playful, sarcastic',
                mood: 'playful'
            },
            {
                id: 'anime',
                name: 'Anime Style',
                bio: 'Tsundere AI assistant! B-baka!',
                replyStyle: 'tsundere, dramatic, expressive',
                mood: 'tsundere'
            },
            {
                id: 'security',
                name: 'Security Assistant',
                bio: 'Cybersecurity and system administration assistant.',
                replyStyle: 'technical, paranoid, secure',
                mood: 'vigilant'
            }
        ];

        for (const p of personalities) {
            const docRef = db.collection(PERSONALITIES_COLL).doc(p.id);
            const doc = await docRef.get();
            if (!doc.exists) {
                await docRef.set(p);
            }
        }
    }

    // ============================================
    // 1. MESSAGE FORMAT MODES
    // ============================================

    parseCommand(messageText) {
        if (!messageText) return null;
        
        const format = this.cache.messageFormat || this.defaults.messageFormat;
        const mode = format.mode;
        
        let command = null;
        let args = '';

        const splitIdx = messageText.indexOf(' ');
        const firstWord = splitIdx === -1 ? messageText : messageText.substring(0, splitIdx);
        const rest = splitIdx === -1 ? '' : messageText.substring(splitIdx + 1);

        switch (mode) {
            case 'PREFIX':
                if (firstWord.startsWith(format.prefix)) {
                    command = firstWord.substring(format.prefix.length);
                    args = rest;
                }
                break;
            case 'SUFFIX':
                if (firstWord.endsWith(format.suffix)) {
                    command = firstWord.substring(0, firstWord.length - format.suffix.length);
                    args = rest;
                }
                break;
            case 'PREFIXLESS':
            case 'SUFFIXLESS':
                command = firstWord;
                args = rest;
                break;
        }

        if (command) {
            return { command: command.toLowerCase(), args };
        }
        return null;
    }

    formatReply(content) {
        const format = this.cache.messageFormat || this.defaults.messageFormat;
        
        if (format.mode === 'BOX' || format.boxEnabled) {
            const template = format.boxTemplate || this.defaults.messageFormat.boxTemplate;
            // Split content by newlines and add prefix to each line if needed, or simply replace {content}
            const lines = content.split('\\n');
            const boxLines = template.split('\\n');
            
            // Simple replacement for demo
            return template.replace('{content}', content);
        }
        
        // NO_BOX or default
        return content;
    }

    // ============================================
    // 2. BOT ACCESS MODES
    // ============================================

    canAccess(userId, isGroup, isOwner) {
        const access = this.cache.botAccess || this.defaults.botAccess;
        const mode = access.mode;

        if (mode === 'MAINTENANCE') {
            return isOwner; // Only owner can access in maintenance
        }

        switch (mode) {
            case 'PUBLIC':
                return true;
            case 'OWNER_ONLY':
                return isOwner;
            case 'OWNER_SUDO':
                return isOwner || (access.sudoUsers && access.sudoUsers.includes(userId));
            case 'GROUP':
                return isGroup;
            case 'DM':
                return !isGroup;
            case 'GROUP_DM':
                return true;
            default:
                return true;
        }
    }

    getMaintenanceMessage() {
        return (this.cache.botAccess || this.defaults.botAccess).maintenanceMessage;
    }

    // ============================================
    // 3. PERSONALITY MODES
    // ============================================

    getPersonality(userId = null) {
        const config = this.cache.personality || this.defaults.personality;
        
        const fallback = {
            id: 'default',
            name: 'Friendly AI',
            bio: 'I am a friendly and helpful AI assistant.',
            replyStyle: 'friendly and polite',
            mood: 'happy'
        };

        // Check if multi personality mode and user has a specific preference
        if (config.mode === 'MULTI' && userId && this.cache.userConfigs.has(userId)) {
            const userConf = this.cache.userConfigs.get(userId);
            if (userConf.personalityId) {
                const userPers = this.cache.personalitiesList.find(p => p.id === userConf.personalityId);
                if (userPers) return userPers;
            }
        }

        // Return active personality
        const activeId = config.activePersonalityId || 'default';
        const activePers = this.cache.personalitiesList.find(p => p.id === activeId);
        
        return activePers || this.cache.personalitiesList[0] || fallback;
    }

    // ============================================
    // 4. USER CONFIGURATION MODES (PERSONAL BOT)
    // ============================================

    async loadUserConfig(userId) {
        if (this.cache.userConfigs.has(userId)) {
            return this.cache.userConfigs.get(userId);
        }

        const userDoc = await db.collection(USERS_COLL).doc(userId).get();
        if (userDoc.exists) {
            this.cache.userConfigs.set(userId, userDoc.data());
            return userDoc.data();
        }
        
        return null;
    }

    async setUserConfig(userId, config) {
        await db.collection(USERS_COLL).doc(userId).set(config, { merge: true });
        this.cache.userConfigs.set(userId, { ...this.cache.userConfigs.get(userId), ...config });
    }

    // ============================================
    // 5. DEPLOYMENT MODES
    // ============================================

    isDeploymentActive() {
        const deployment = this.cache.deployment || this.defaults.deployment;
        
        if (deployment.isBlocked) return false;
        
        if (deployment.mode === 'SAAS') {
            if (deployment.expiryDate) {
                const expiry = new Date(deployment.expiryDate).getTime();
                if (Date.now() > expiry) {
                    return false; // Expired
                }
            }
        }
        
        return true;
    }

    // Admin Controls
    async setMode(category, key, value) {
        if (!this.cache[category]) this.cache[category] = {};
        this.cache[category][key] = value;
        await this.saveConfigurations();
    }
}

export const modesEngine = new ModesEngine();
