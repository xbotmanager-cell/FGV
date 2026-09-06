import fs from 'fs';

let content = fs.readFileSync('utils/commandManager.js', 'utf8');
content = content.replace(/if \(!doc\.exists\) \{/, 'if (true) {');
fs.writeFileSync('utils/commandManager.js', content);
