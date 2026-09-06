import { db } from './firebaseAdmin.js';

class SyncSystem {
    constructor() {
        this.collection = db.collection('SyncRequests');
        this.configCollection = db.collection('Configurations');
    }

    async saveBotConfiguration(botId, configData) {
        await this.configCollection.add({
            botId,
            configData: JSON.stringify(configData),
            createdAt: new Date().toISOString()
        });
        return { success: true };
    }

    async getBotConfiguration(botId) {
        const snapshot = await this.configCollection.where('botId', '==', botId).orderBy('createdAt', 'desc').limit(1).get();
        if (snapshot.empty) return null;
        return JSON.parse(snapshot.docs[0].data().configData);
    }

    async requestSync(sourceBotId, targetBotId, dataToSync) {
        const requestData = {
            sourceBotId,
            targetBotId,
            dataToSync: JSON.stringify(dataToSync),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const ref = await this.collection.add(requestData);
        return { success: true, requestId: ref.id };
    }

    async approveSync(requestId, targetBotOwnerId) {
        const reqDoc = await this.collection.doc(requestId).get();
        if (!reqDoc.exists) return { success: false, error: 'Request not found' };
        
        const data = reqDoc.data();
        if (data.status !== 'pending') return { success: false, error: 'Request is not pending' };
        
        await this.collection.doc(requestId).update({ status: 'approved' });
        
        // Execute sync logic based on dataToSync
        const sourceConfig = await this.getBotConfiguration(data.sourceBotId);
        if (sourceConfig) {
            // Target bot logic would apply sourceConfig specific parts
            await this.collection.doc(requestId).update({ status: 'completed' });
            return { success: true, syncedData: sourceConfig };
        }
        
        return { success: false, error: 'Failed to retrieve source configuration' };
    }

    async rejectSync(requestId, targetBotOwnerId) {
        const reqDoc = await this.collection.doc(requestId).get();
        if (!reqDoc.exists) return { success: false, error: 'Request not found' };
        
        await this.collection.doc(requestId).update({ status: 'rejected' });
        return { success: true };
    }
}

export const syncSystem = new SyncSystem();
