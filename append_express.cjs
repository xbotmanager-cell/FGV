const fs = require('fs');
let code = fs.readFileSync('index.js', 'utf8');

const expressCode = `
// ==========================================
//   WEB SERVER FOR DASHBOARD (RENDER PORT BINDING)
// ==========================================
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/stats', (req, res) => {
    res.json({
        botName: BOT_NAME || 'BUNNY TECH',
        version: VERSION || '1.1.3',
        prefix: typeof isPrefixless !== 'undefined' ? (isPrefixless ? 'none' : getCurrentPrefix()) : 'none',
        commandsCount: typeof commands !== 'undefined' ? commands.size : 0,
        ownerNumber: typeof jidManager !== 'undefined' && jidManager.owner ? jidManager.owner.cleanNumber : 'Not Set',
        status: typeof isConnected !== 'undefined' && isConnected ? 'Online' : 'Offline'
    });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    if (typeof UltraCleanLogger !== 'undefined') {
        UltraCleanLogger.info(\`🌐 Web dashboard running on port \${port}\`);
    } else {
        console.log(\`🌐 Web dashboard running on port \${port}\`);
    }
});
`;

if (!code.includes('app.listen(port')) {
    fs.appendFileSync('index.js', expressCode);
    console.log('Appended express server.');
} else {
    console.log('Express already appended.');
}
