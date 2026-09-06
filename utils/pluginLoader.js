import fs from 'fs';
import path from 'path';
import { commandManager } from './commandManager.js';

export async function loadPlugins() {
    const pluginsDir = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginsDir)) return;
    
    // Also load legacy root plugins if any
    const rootFiles = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    for (const file of rootFiles) {
        try {
            const modulePath = `file://${path.join(pluginsDir, file)}`;
            const module = await import(modulePath);
            if (typeof module.default === 'function') {
                module.default();
            }
        } catch (e) {
            console.error(`[PluginLoader] Failed to load root plugin ${file}:`, e.message);
        }
    }

    const folders = fs.readdirSync(pluginsDir);
    for (const folder of folders) {
        const folderPath = path.join(pluginsDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
            for (const file of files) {
                try {
                    const modulePath = `file://${path.join(folderPath, file)}`;
                    const module = await import(modulePath);
                    if (module.default) {
                        if (typeof module.default === 'function') {
                            module.default();
                        } else if (typeof module.default === 'object') {
                            commandManager.registerBaseCommand(module.default);
                        }
                    }
                } catch (e) {
                    console.error(`[PluginLoader] Failed to load ${file}:`, e.message);
                }
            }
        }
    }
}
