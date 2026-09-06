import fs from 'fs';

let content = fs.readFileSync('utils/commandManager.js', 'utf8');
content = content.replace(/if \(true\) \{/, 'if (!doc.exists || !doc.data().responses) {');
fs.writeFileSync('utils/commandManager.js', content);
