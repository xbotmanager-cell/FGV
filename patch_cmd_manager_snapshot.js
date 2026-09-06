import fs from 'fs';
let content = fs.readFileSync('utils/commandManager.js', 'utf8');
content = content.replace(/snapshot\.forEach\(doc => \{/g, 'snapshot.docs.forEach(doc => {');
fs.writeFileSync('utils/commandManager.js', content);
