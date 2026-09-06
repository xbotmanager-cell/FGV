const fs = require('fs');

let content = fs.readFileSync('api/routes.js', 'utf8');

const routesToInject = `
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
`;

if (!content.includes('/auth/login')) {
    content = content.replace('export default router;', routesToInject + '\nexport default router;');
    fs.writeFileSync('api/routes.js', content);
    console.log('Routes injected successfully!');
} else {
    console.log('Routes already injected.');
}
