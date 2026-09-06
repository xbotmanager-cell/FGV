import { db } from './firebaseAdmin.js';

class GroupSecuritySystem {
    constructor() {
        this.securityCol = db.collection('SecurityRules');
    }

    async toggleSecurity(botId, groupId, config) {
        const data = { botId, groupId, ...config };
        const snapshot = await this.securityCol.where('botId', '==', botId).where('groupId', '==', groupId).get();
        if (snapshot.empty) {
            await this.securityCol.add(data);
        } else {
            await this.securityCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async getSecurityConfig(botId, groupId) {
        const snapshot = await this.securityCol.where('botId', '==', botId).where('groupId', '==', groupId).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    }

    async processMessageSecurity(botId, groupId, userId, messageContent) {
        const config = await this.getSecurityConfig(botId, groupId);
        if (!config) return { triggered: false };

        const violations = [];

        // Simulated checks
        if (config.antiLink && messageContent.includes('http')) {
            violations.push('antiLink');
        }
        if (config.antiBadWords && (messageContent.includes('badword1') || messageContent.includes('badword2'))) {
            violations.push('antiBadWords');
        }
        // Additional checks like antiSpam, antiFlood would rely on historical message checks
        
        if (violations.length > 0) {
            return {
                triggered: true,
                violations,
                action: config.action || 'warn'
            };
        }

        return { triggered: false };
    }
}

export const groupSecuritySystem = new GroupSecuritySystem();
