import { db } from './firebaseAdmin.js';

class LockSystem {
    constructor() {
        this.collection = db.collection('Locks');
        this.locksCache = new Map();
        this.initCache();
    }

    async initCache() {
        this.collection.where('status', '==', 'active').onSnapshot(snapshot => {
            this.locksCache.clear();
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                this.locksCache.set(`${data.itemType}_${data.itemName}`, data);
            });
        });
    }

    async lockItem(itemType, itemName, reason, adminId, lockType = 'global', targetBotId = null) {
        const lockData = {
            itemType,
            itemName,
            reason,
            adminId,
            lockType,
            targetBotId,
            status: 'active',
            date: new Date().toISOString()
        };
        const ref = await this.collection.add(lockData);
        return { success: true, lockId: ref.id };
    }

    async unlockItem(itemType, itemName) {
        const snapshot = await this.collection.where('itemType', '==', itemType).where('itemName', '==', itemName).where('status', '==', 'active').get();
        if (snapshot.empty) return { success: false, error: 'Lock not found' };
        
        for (const doc of snapshot.docs) {
            await this.collection.doc(doc.id).update({ status: 'inactive' });
        }
        return { success: true };
    }

    isLocked(itemType, itemName, botId = null) {
        const lock = this.locksCache.get(`${itemType}_${itemName}`);
        if (!lock) return { locked: false };
        if (lock.lockType === 'global' || lock.lockType === 'permanent' || lock.lockType === 'temporary') {
            return { locked: true, reason: lock.reason };
        }
        if (lock.lockType === 'selected_bot' && lock.targetBotId === botId) {
            return { locked: true, reason: lock.reason };
        }
        return { locked: false };
    }
}

export const lockSystem = new LockSystem();
