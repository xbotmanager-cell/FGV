import { db } from './firebaseAdmin.js';
import fs from 'fs';
import path from 'path';

class ExportImportSystem {
    constructor() {
        this.exportsCollection = db.collection('Exports');
        this.importsCollection = db.collection('Imports');
        this.exportDir = path.resolve(process.cwd(), 'exports');
        if (!fs.existsSync(this.exportDir)) fs.mkdirSync(this.exportDir, { recursive: true });
    }

    async exportSettings(botId, settings, commands, aliases, personalities, permissions, modes, pluginsConfig) {
        const exportData = {
            botIdentity: botId,
            version: '1.0.0',
            settings,
            commands,
            aliases,
            personalities,
            permissions,
            modes,
            pluginsConfig,
            exportedAt: new Date().toISOString()
        };

        const jsonStr = JSON.stringify(exportData, null, 2);
        const fileName = `export_${botId}_${Date.now()}.txt`;
        const filePath = path.join(this.exportDir, fileName);
        
        fs.writeFileSync(filePath, jsonStr);

        const ref = await this.exportsCollection.add({
            botId,
            exportData: jsonStr,
            version: '1.0.0',
            createdAt: new Date().toISOString()
        });

        return { success: true, file: filePath, exportId: ref.id };
    }

    async validateImport(importDataStr) {
        try {
            const data = JSON.parse(importDataStr);
            if (!data.botIdentity || !data.version) return { valid: false, error: 'Invalid configuration format' };
            // Simulate conflict check
            return { valid: true, preview: data };
        } catch (error) {
            return { valid: false, error: 'Failed to parse configuration' };
        }
    }

    async importSettings(botId, importDataStr, isPartial = false) {
        const validation = await this.validateImport(importDataStr);
        if (!validation.valid) return { success: false, error: validation.error };

        const ref = await this.importsCollection.add({
            botId,
            importData: importDataStr,
            status: 'success',
            createdAt: new Date().toISOString()
        });

        return { success: true, data: validation.preview, importId: ref.id };
    }
}

export const exportImportSystem = new ExportImportSystem();
