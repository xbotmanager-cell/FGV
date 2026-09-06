import { db } from './firebaseAdmin.js';

class UpdateSystem {
    constructor() {
        this.collection = db.collection('Updates');
        this.logCollection = db.collection('UpdateLogs');
    }

    async pushUserUpdate(botId, changes) {
        const updateData = {
            botId,
            updateType: 'user',
            changes: JSON.stringify(changes),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const ref = await this.collection.add(updateData);
        await this.logUpdate(ref.id, `User update pushed for bot ${botId}`);
        return { success: true, updateId: ref.id };
    }

    async pushGlobalUpdate(changes, target = 'all', targetIds = []) {
        const updateData = {
            botId: 'global',
            updateType: 'global',
            target,
            targetIds,
            changes: JSON.stringify(changes),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const ref = await this.collection.add(updateData);
        await this.logUpdate(ref.id, `Global update pushed targeting ${target}`);
        return { success: true, updateId: ref.id };
    }

    async applyUpdate(updateId, botId) {
        try {
            const updateDoc = await this.collection.doc(updateId).get();
            if (!updateDoc.exists) return { success: false, error: 'Update not found' };
            
            await this.collection.doc(updateId).update({ status: 'applied' });
            await this.logUpdate(updateId, `Update applied to bot ${botId}`);
            return { success: true };
        } catch (error) {
            await this.logUpdate(updateId, `Update failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async logUpdate(updateId, message) {
        await this.logCollection.add({
            updateId,
            log: message,
            createdAt: new Date().toISOString()
        });
    }

    listenForUpdates(botId, onUpdateCallback) {
        return this.collection.where('status', '==', 'pending').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.botId === botId || (data.updateType === 'global' && (data.target === 'all' || data.targetIds.includes(botId)))) {
                    onUpdateCallback({ id: doc.id, ...data });
                }
            });
        });
    }
}

export const updateSystem = new UpdateSystem();
