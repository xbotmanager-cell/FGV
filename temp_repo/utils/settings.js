import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = './settings.json';

class SettingsManager {
    constructor() {
        this.settings = {};
        this.loadSettings();
    }

    loadSettings() {
        try {
            if (fs.existsSync(SETTINGS_FILE)) {
                const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
                this.settings = JSON.parse(data);
            }
        } catch (e) {
            console.error("Error loading settings:", e.message);
        }
    }

    saveSettings() {
        try {
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify(this.settings, null, 4));
        } catch (e) {
            console.error("Error saving settings:", e.message);
        }
    }

    get(key, defaultValue = null) {
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }

    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
}

const settings = new SettingsManager();
export default settings;
