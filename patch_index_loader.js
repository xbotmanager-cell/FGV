import fs from 'fs';
let content = fs.readFileSync('index.js', 'utf8');

const loaderRegex = /registerSettingsCommands\(\);\s+registerGeneralCommands\(\);/g;

content = content.replace("import registerSettingsCommands from './plugins/settings_commands.js';", "import { loadPlugins } from './utils/pluginLoader.js';");
content = content.replace("import registerGeneralCommands from './plugins/general_commands.js';", "");

content = content.replace(loaderRegex, "await loadPlugins();");
fs.writeFileSync('index.js', content);
