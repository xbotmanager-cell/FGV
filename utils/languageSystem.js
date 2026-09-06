import { db } from './firebaseAdmin.js';
import crypto from 'crypto';

class LanguageSystem {
    constructor() {
        this.globalLangCol = db.collection('Languages');
        this.botLangCol = db.collection('BotLanguageSettings');
        this.cacheCol = db.collection('TranslationCache');
        this.initListeners();
        this.globalConfig = { defaultLanguage: 'en', forceTranslationMode: false };
        this.botLanguages = new Map();
    }

    initListeners() {
        this.globalLangCol.onSnapshot(snapshot => {
            if (!snapshot.empty) {
                this.globalConfig = snapshot.docs[0].data();
            }
        });
        
        this.botLangCol.onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                this.botLanguages.set(data.botId, data.language);
            });
        });
    }

    async setGlobalLanguage(defaultLanguage, supportedLanguages, forceTranslationMode) {
        const data = { defaultLanguage, supportedLanguages, forceTranslationMode, updatedAt: new Date().toISOString() };
        const snapshot = await this.globalLangCol.get();
        if (snapshot.empty) {
            await this.globalLangCol.add(data);
        } else {
            await this.globalLangCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async setBotLanguage(botId, language) {
        const data = { botId, language, updatedAt: new Date().toISOString() };
        const snapshot = await this.botLangCol.where('botId', '==', botId).get();
        if (snapshot.empty) {
            await this.botLangCol.add(data);
        } else {
            await this.botLangCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    getBotLanguage(botId) {
        if (this.globalConfig.forceTranslationMode && this.globalConfig.defaultLanguage) {
            return this.globalConfig.defaultLanguage;
        }
        return this.botLanguages.get(botId) || this.globalConfig.defaultLanguage || 'en';
    }

    generateHash(text) {
        return crypto.createHash('md5').update(text).digest('hex');
    }

    async getCachedTranslation(text, targetLang) {
        const hash = this.generateHash(text);
        const snapshot = await this.cacheCol
            .where('textHash', '==', hash)
            .where('targetLang', '==', targetLang)
            .get();
            
        if (snapshot.empty) return null;
        return snapshot.docs[0].data().translatedText;
    }

    async saveTranslationCache(text, targetLang, translatedText) {
        const hash = this.generateHash(text);
        await this.cacheCol.add({
            textHash: hash,
            originalText: text,
            targetLang,
            translatedText,
            createdAt: new Date().toISOString()
        });
    }

    async translate(text, botId) {
        const targetLang = this.getBotLanguage(botId);
        if (targetLang === 'en') return text; // Default assumes source is English

        // 1. Check Cache
        const cached = await this.getCachedTranslation(text, targetLang);
        if (cached) return cached;

        // 2. Perform translation via API (Simulated or using actual fallback provider if wired up)
        // Note: Real implementation would use Google Translate API or ApiManager.
        const translatedText = `[${targetLang}] ${text}`; // Dummy simulation
        
        // 3. Save Cache
        await this.saveTranslationCache(text, targetLang, translatedText);
        
        return translatedText;
    }
}

export const languageSystem = new LanguageSystem();
