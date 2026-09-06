import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/firebaseAdmin.js';
import rateLimit from 'express-rate-limit';
import { commandManager } from '../utils/commandManager.js';
import { managementLayer } from '../utils/managementLayer.js';

const router = express.Router();

const apiAuth = async (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (!apiKey) return res.status(401).json({ error: 'Missing API-Key header' });

    try {
        const keyQuery = await db.collection('api_keys').where('apiKey', '==', apiKey).limit(1).get();
        if (keyQuery.empty) return res.status(401).json({ error: 'Invalid API Key' });
        const keyData = keyQuery.docs[0].data();
        if (keyData.status === 'disabled') return res.status(403).json({ error: 'API Key is disabled' });

        req.apiContext = { id: keyQuery.docs[0].id, ...keyData };
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authentication service error' });
    }
};

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100, message: { error: 'Too many requests, please try again later.' } });
router.use(limiter);

// ----------------------------------------------------------------------
// DEVELOPER API ROUTES
// ----------------------------------------------------------------------
router.post('/send-message', apiAuth, async (req, res) => {
    // [Previous logic unchanged]
});

// ----------------------------------------------------------------------
// BOT BUILDER SYSTEM ROUTES
// ----------------------------------------------------------------------
router.get('/bots/project/:ticket', async (req, res) => {
    try {
        const ticket = req.params.ticket;
        const doc = await db.collection('BotProjects').doc(ticket).get();
        if (doc.exists) {
            res.json(doc.data());
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/bots/project/:ticket', async (req, res) => {
    try {
        const ticket = req.params.ticket;
        const updates = req.body;
        
        const doc = await db.collection('BotProjects').doc(ticket).get();
        if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
        
        const project = doc.data();
        const updatedConfig = { ...project.config, ...updates };
        
        await db.collection('BotProjects').doc(ticket).update({
            config: updatedConfig,
            updatedAt: new Date().toISOString(),
            fingerprint: uuidv4()
        });
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/bots/build/:ticket', async (req, res) => {
    try {
        const ticket = req.params.ticket;
        const doc = await db.collection('BotProjects').doc(ticket).get();
        if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
        
        await db.collection('BotProjects').doc(ticket).update({
            status: 'ready',
            updatedAt: new Date().toISOString()
        });
        
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        res.json({
            success: true,
            githubForkUrl: `https://github.com/bunny-tech/master-bot/fork?ticket=${ticket}`,
            downloadZipUrl: `${appUrl}/api/bots/download/${ticket}`
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ----------------------------------------------------------------------
// COMMAND API ROUTES
// ----------------------------------------------------------------------
router.get('/commands', async (req, res) => {
    const commands = Array.from(commandManager.commands.values());
    res.json({ commands });
});

router.post('/commands/:id', apiAuth, async (req, res) => {
    if (!req.apiContext.permissions.includes('admin')) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    const { id } = req.params;
    const { action, newName, alias, status } = req.body;
    
    try {
        if (action === 'rename') {
            await commandManager.renameCommand(id, newName, `API (${req.apiContext.ownerId})`);
        } else if (action === 'addAlias') {
            await commandManager.addAlias(id, alias, `API (${req.apiContext.ownerId})`);
        } else if (action === 'toggle') {
            await commandManager.updateCommand(id, { status }, `API (${req.apiContext.ownerId})`);
        } else if (action === 'restore') {
            await commandManager.restoreCommand(id, `API (${req.apiContext.ownerId})`);
        }
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/bot-config', apiAuth, async (req, res) => {
    if (!req.apiContext.permissions.includes('admin')) return res.status(403).json({ error: 'Permission denied' });
    const { mode, prefix, suffix } = req.body;
    
    try {
        await db.collection('bot_config').doc('command_settings').set({ mode, prefix, suffix }, { merge: true });
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/command-logs', async (req, res) => {
    const snapshot = await db.collection('command_logs').orderBy('timestamp', 'desc').limit(50).get();
    res.json(snapshot.docs.map(doc => doc.data()));
});

// ----------------------------------------------------------------------
// ADMIN ROUTES (Internal/Dashboard use)
// ----------------------------------------------------------------------
router.get('/admin/sessions', async (req, res) => {
    try {
        const snapshot = await db.collection('sessions').orderBy('lastConnectionTime', 'desc').get();
        res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { 
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed', message: error.message }); 
    }
});

router.get('/admin/api-keys', async (req, res) => {
    try {
        const snapshot = await db.collection('api_keys').orderBy('createdAt', 'desc').get();
        res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/admin/messages', async (req, res) => {
    try {
        const snapshot = await db.collection('messages').orderBy('timestamp', 'desc').limit(20).get();
        res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/admin/api-keys', async (req, res) => {
    const apiKey = `wk_${uuidv4().replace(/-/g, '')}`;
    const keyDoc = {
        apiKey,
        ownerId: req.body.ownerId || 'admin',
        permissions: ['send_message', 'admin'],
        usageLimit: 10000,
        requestsCount: 0,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('api_keys').add(keyDoc);
    res.json({ id: docRef.id, ...keyDoc });
});

// ----------------------------------------------------------------------
// ADVANCED MANAGEMENT LAYER ROUTES
// ----------------------------------------------------------------------
router.post('/admin/updates/user', async (req, res) => {
    try {
        const { botId, changes } = req.body;
        const result = await managementLayer.updateSystem.pushUserUpdate(botId, changes);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/updates/global', async (req, res) => {
    try {
        const { changes, target, targetIds } = req.body;
        const result = await managementLayer.updateSystem.pushGlobalUpdate(changes, target, targetIds);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/locks/lock', async (req, res) => {
    try {
        const { itemType, itemName, reason, adminId, lockType, targetBotId } = req.body;
        const result = await managementLayer.lockSystem.lockItem(itemType, itemName, reason, adminId, lockType, targetBotId);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/locks/unlock', async (req, res) => {
    try {
        const { itemType, itemName } = req.body;
        const result = await managementLayer.lockSystem.unlockItem(itemType, itemName);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/sudo/add', async (req, res) => {
    try {
        const { userId, addedBy, accessLevel, commands, features, expirationDate } = req.body;
        const result = await managementLayer.sudoSystem.addSudoUser(userId, addedBy, accessLevel, commands, features, expirationDate);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/export', async (req, res) => {
    try {
        const { botId, settings, commands, aliases, personalities, permissions, modes, pluginsConfig } = req.body;
        const result = await managementLayer.exportImportSystem.exportSettings(botId, settings, commands, aliases, personalities, permissions, modes, pluginsConfig);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/import', async (req, res) => {
    try {
        const { botId, importDataStr, isPartial } = req.body;
        const result = await managementLayer.exportImportSystem.importSettings(botId, importDataStr, isPartial);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/sync/request', async (req, res) => {
    try {
        const { sourceBotId, targetBotId, dataToSync } = req.body;
        const result = await managementLayer.syncSystem.requestSync(sourceBotId, targetBotId, dataToSync);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ----------------------------------------------------------------------
// PART 2: ADVANCED MANAGEMENT LAYER ROUTES
// ----------------------------------------------------------------------

router.post('/admin/triggers/create', async (req, res) => {
    try {
        const { botId, eventType, conditions, actionType, actionPayload } = req.body;
        const result = await managementLayer.triggerSystem.createTrigger(botId, eventType, conditions, actionType, actionPayload);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/games/toggle', async (req, res) => {
    try {
        const { botId, gameType, status, config } = req.body;
        const result = await managementLayer.gameSystem.toggleGameModule(botId, gameType, status, config);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/images/template/save', async (req, res) => {
    try {
        const { botId, name, type, config } = req.body;
        const result = await managementLayer.imageResponseSystem.saveTemplate(botId, name, type, config);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/commands/profile/save', async (req, res) => {
    try {
        const { botId, name, category, profileData } = req.body;
        const result = await managementLayer.advancedCommandSystem.saveCommandProfile(botId, name, category, profileData);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/menus/config/save', async (req, res) => {
    try {
        const { botId, config } = req.body;
        const result = await managementLayer.menuSystem.saveMenuConfig(botId, config);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ----------------------------------------------------------------------
// PART 3: CORE INFRASTRUCTURE ROUTES
// ----------------------------------------------------------------------

router.post('/admin/deployments/register', async (req, res) => {
    try {
        const { botId, ownerId, whatsappNumber, config, version } = req.body;
        const result = await managementLayer.deploymentSystem.registerBot(botId, ownerId, whatsappNumber, config, version);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/language/global', async (req, res) => {
    try {
        const { defaultLanguage, supportedLanguages, forceTranslationMode } = req.body;
        const result = await managementLayer.languageSystem.setGlobalLanguage(defaultLanguage, supportedLanguages, forceTranslationMode);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/language/bot', async (req, res) => {
    try {
        const { botId, language } = req.body;
        const result = await managementLayer.languageSystem.setBotLanguage(botId, language);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/api/provider', async (req, res) => {
    try {
        const { name, service, apiKey, status, priority, usageLimits } = req.body;
        const result = await managementLayer.apiManager.addProvider(name, service, apiKey, status, priority, usageLimits);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ----------------------------------------------------------------------
// PART 4: ADVANCED BUSINESS SYSTEMS ROUTES
// ----------------------------------------------------------------------

router.post('/admin/channel/config', async (req, res) => {
    try {
        const { botId, channelId, config } = req.body;
        const result = await managementLayer.channelGroupSystem.setChannelConfig(botId, channelId, config);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/spam/cooldown', async (req, res) => {
    try {
        const { botId, command, limit, timeframeSeconds } = req.body;
        const result = await managementLayer.antiSpamSystem.setCooldownRule(botId, command, limit, timeframeSeconds);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/security/toggle', async (req, res) => {
    try {
        const { botId, groupId, config } = req.body;
        const result = await managementLayer.groupSecuritySystem.toggleSecurity(botId, groupId, config);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/custombot/save', async (req, res) => {
    try {
        const { botId, userId, profileData } = req.body;
        const result = await managementLayer.customBotBuilder.saveCustomProfile(botId, userId, profileData);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/custombot/export', async (req, res) => {
    try {
        const { botId, userId } = req.body;
        const result = await managementLayer.customBotBuilder.exportBotPackage(botId, userId);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/custombot/github', async (req, res) => {
    try {
        const { botId, repoName, gitToken } = req.body;
        const result = await managementLayer.customBotBuilder.pushToGitHub(botId, repoName, gitToken);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/custombot/ai-generate', async (req, res) => {
    try {
        const { botId, prompt } = req.body;
        const result = await managementLayer.aiBotCreator.generateBotConfig(botId, prompt);
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});


// ----------------------------------------------------------------------
// NEW PRODUCTION DASHBOARD ROUTES
// ----------------------------------------------------------------------

router.post('/auth/login', async (req, res) => {
    try {
        const { phone, password, isSuperAdmin, email } = req.body;
        
        // Super Admin Auth (Google Firebase)
        if (isSuperAdmin) {
            if (email === 'lupinstarnley006@gmail.com') {
                return res.json({ success: true, role: 'admin', message: 'Super Admin Access Granted' });
            }
            return res.status(403).json({ error: 'Unauthorized email' });
        }
        
        // Emergency Recovery
        if (phone === '255780470905' && password === '2892') {
            console.log('[EMERGENCY] Recovery access used!');
            return res.json({ success: true, role: 'owner', message: 'Emergency Recovery Access Granted' });
        }
        
        // Standard Bot Owner Auth
        const credsDoc = await db.collection('bot_credentials').doc(phone).get();
        if (!credsDoc.exists) {
            return res.status(401).json({ error: 'Invalid phone number or not paired.' });
        }
        
        const creds = credsDoc.data();
        if (creds.password === password) {
            return res.json({ success: true, role: 'owner', message: 'Dashboard Access Granted' });
        }
        
        res.status(401).json({ error: 'Invalid password' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/commands/save", async (req, res) => { try { const cmdData = req.body; const id = cmdData.currentName.toLowerCase(); await db.collection("commands").doc(id).set({ ...cmdData, id, updatedAt: new Date().toISOString() }, { merge: true }); res.json({ success: true, message: "Command saved" }); } catch (e) { res.status(500).json({ error: e.message }); } }); router.post("/commands/delete", async (req, res) => { try { const { id } = req.body; await db.collection("commands").doc(id).delete(); res.json({ success: true, message: "Deleted" }); } catch (e) { res.status(500).json({ error: e.message }); } });

router.get('/commands', async (req, res) => {
    try {
        const commands = Array.from(commandManager.commands.values());
        res.json({ commands });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/apikeys', async (req, res) => {
    try {
        const keysSnapshot = await db.collection('api_keys').get();
        const keys = [];
        keysSnapshot.forEach(doc => keys.push({ id: doc.id, ...doc.data() }));
        res.json({ keys });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const projSnapshot = await db.collection('BotProjects').get();
        const projects = [];
        projSnapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
        res.json({ projects });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/features', async (req, res) => {
    try {
        // Read global toggles
        const configDoc = await db.collection('bot_config').doc('features').get();
        const features = configDoc.exists ? configDoc.data() : {
            antiSpam: true, autoCommands: true, triggers: true, games: true, languages: true, imageMode: false
        };
        res.json({ features });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/features', async (req, res) => {
    try {
        const { features } = req.body;
        await db.collection('bot_config').doc('features').set(features, { merge: true });
        res.json({ success: true, features });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/modes', async (req, res) => {
    try {
        const configDoc = await db.collection('bot_config').doc('modes').get();
        const modes = configDoc.exists ? configDoc.data() : {
            prefix: true, prefixless: false, suffix: false, box: false, personality: true, owner: true, sudo: false, group: true, dm: true, maintenance: false
        };
        res.json({ modes });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/modes', async (req, res) => {
    try {
        const { modes } = req.body;
        await db.collection('bot_config').doc('modes').set(modes, { merge: true });
        res.json({ success: true, modes });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;

// ----------------------------------------------------------------------
// ENGINES & PROFILES API ROUTES
// ----------------------------------------------------------------------

router.get('/personalities', async (req, res) => {
    try {
        const snapshot = await db.collection('personalities').get();
        const personalities = [];
        snapshot.forEach(doc => personalities.push({ id: doc.id, ...doc.data() }));
        res.json({ personalities });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/box-styles', async (req, res) => {
    try {
        const snapshot = await db.collection('box_styles').get();
        const styles = [];
        snapshot.forEach(doc => styles.push({ id: doc.id, ...doc.data() }));
        res.json({ styles });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/bot-profiles', async (req, res) => {
    try {
        const snapshot = await db.collection('bot_profiles').get();
        const profiles = [];
        snapshot.forEach(doc => profiles.push({ id: doc.id, ...doc.data() }));
        res.json({ profiles });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
