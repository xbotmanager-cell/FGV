import { db } from './firebaseAdmin.js';

class DeploymentSystem {
    constructor() {
        this.deploymentsCol = db.collection('BotDeployments');
    }

    async registerBot(botId, ownerId, whatsappNumber, config, version) {
        const deploymentData = {
            botId,
            ownerId,
            whatsappNumber,
            sessionStatus: 'connected',
            config: JSON.stringify(config),
            version,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const snapshot = await this.deploymentsCol.where('botId', '==', botId).get();
        if (snapshot.empty) {
            await this.deploymentsCol.add(deploymentData);
        } else {
            await this.deploymentsCol.doc(snapshot.docs[0].id).update({
                ...deploymentData,
                createdAt: snapshot.docs[0].data().createdAt
            });
        }
        return { success: true, message: 'Bot registered successfully' };
    }

    async updateSessionStatus(botId, status) {
        const snapshot = await this.deploymentsCol.where('botId', '==', botId).get();
        if (!snapshot.empty) {
            await this.deploymentsCol.doc(snapshot.docs[0].id).update({
                sessionStatus: status,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        }
        return { success: false, error: 'Bot not found' };
    }

    async getBotDeploymentInfo(botId) {
        const snapshot = await this.deploymentsCol.where('botId', '==', botId).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    }

    async getAllDeployments() {
        const snapshot = await this.deploymentsCol.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

export const deploymentSystem = new DeploymentSystem();
