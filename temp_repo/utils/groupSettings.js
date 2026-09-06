import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = './group_settings.json';

class GroupSettingsManager {
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
            console.error("Error loading group settings:", e.message);
        }
    }

    saveSettings() {
        try {
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify(this.settings, null, 4));
        } catch (e) {
            console.error("Error saving group settings:", e.message);
        }
    }

    get(groupId, key, defaultValue = null) {
        if (!this.settings[groupId]) return defaultValue;
        return this.settings[groupId][key] !== undefined ? this.settings[groupId][key] : defaultValue;
    }

    set(groupId, key, value) {
        if (!this.settings[groupId]) this.settings[groupId] = {};
        this.settings[groupId][key] = value;
        this.saveSettings();
    }

    delete(groupId, key) {
        if (this.settings[groupId] && this.settings[groupId][key] !== undefined) {
            delete this.settings[groupId][key];
            this.saveSettings();
        }
    }
}

const groupSettings = new GroupSettingsManager();
export default groupSettings;
