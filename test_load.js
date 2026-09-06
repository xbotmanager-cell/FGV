import { loadPlugins } from './utils/pluginLoader.js';
loadPlugins().then(() => {
    console.log("Plugins loaded.");
    setTimeout(() => process.exit(0), 1000);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
