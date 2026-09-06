import { loadPlugins } from './utils/pluginLoader.js';
async function run() {
    await loadPlugins();
    console.log("Plugins reloaded.");
    process.exit(0);
}
run();
