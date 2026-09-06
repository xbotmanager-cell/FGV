import fs from 'fs';
let content = fs.readFileSync('utils/pluginLoader.js', 'utf8');

content = content.replace(
    /commandManager\.registerBaseCommand\(module\.default\);/g,
    `await new Promise(r => setTimeout(r, 200));
                            await commandManager.registerBaseCommand(module.default);`
);

fs.writeFileSync('utils/pluginLoader.js', content);
