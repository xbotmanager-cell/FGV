import { db } from './firebaseAdmin.js';

class AntiSpamSystem {
    constructor() {
        this.usageCol = db.collection('CommandUsageLogs');
        this.cooldownCol = db.collection('CooldownRules');
        this.cooldownCache = new Map();
        this.initListeners();
    }

    initListeners() {
        this.cooldownCol.onSnapshot(snapshot => {
            this.cooldownCache.clear();
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                this.cooldownCache.set(`${data.botId}_${data.command}`, data);
            });
        });
    }

    async setCooldownRule(botId, command, limit, timeframeSeconds) {
        const data = { botId, command, limit, timeframeSeconds };
        const snapshot = await this.cooldownCol.where('botId', '==', botId).where('command', '==', command).get();
        if (snapshot.empty) {
            await this.cooldownCol.add(data);
        } else {
            await this.cooldownCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async logUsage(botId, userId, command, isBlocked) {
        await this.usageCol.add({
            botId, userId, command, isBlocked, createdAt: new Date().toISOString()
        });
    }

    async checkSpam(botId, userId, command) {
        const rule = this.cooldownCache.get(`${botId}_${command}`) || this.cooldownCache.get(`global_${command}`);
        if (!rule) return { isBlocked: false };

        const thresholdTime = new Date(Date.now() - (rule.timeframeSeconds * 1000)).toISOString();

        const snapshot = await this.usageCol
            .where('botId', '==', botId)
            .where('userId', '==', userId)
            .where('command', '==', command)
            .where('createdAt', '>=', thresholdTime)
            .get();

        const count = snapshot.size;

        if (count >= rule.limit) {
            await this.logUsage(botId, userId, command, true);
            return { 
                isBlocked: true, 
                message: `Cooldown active. You used this command ${count} times recently. Please wait.` 
            };
        }

        await this.logUsage(botId, userId, command, false);
        return { isBlocked: false };
    }
}

export const antiSpamSystem = new AntiSpamSystem();
