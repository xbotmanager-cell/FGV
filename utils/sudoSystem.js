import { db } from './firebaseAdmin.js';

class SudoSystem {
    constructor() {
        this.collection = db.collection('SudoUsers');
        this.permissionsCollection = db.collection('Permissions');
    }

    async addSudoUser(userId, addedBy, accessLevel, commands = [], features = [], expirationDate = null) {
        const sudoData = {
            userId,
            addedBy,
            status: 'active',
            expirationDate,
            createdAt: new Date().toISOString()
        };
        const ref = await this.collection.add(sudoData);
        
        await this.permissionsCollection.add({
            sudoUserId: ref.id,
            accessLevel,
            commands,
            features,
            createdAt: new Date().toISOString()
        });

        return { success: true, sudoId: ref.id };
    }

    async removeSudoUser(sudoId) {
        await this.collection.doc(sudoId).update({ status: 'removed' });
        return { success: true };
    }

    async banSudoUser(sudoId) {
        await this.collection.doc(sudoId).update({ status: 'banned' });
        return { success: true };
    }

    async restoreSudoUser(sudoId) {
        await this.collection.doc(sudoId).update({ status: 'active' });
        return { success: true };
    }

    async checkPermission(userId, itemType, itemName) {
        const snapshot = await this.collection.where('userId', '==', userId).where('status', '==', 'active').get();
        if (snapshot.empty) return { hasPermission: false };

        for (const doc of snapshot.docs) {
            const sudoData = doc.data();
            if (sudoData.expirationDate && new Date(sudoData.expirationDate) < new Date()) {
                continue; // expired
            }

            const permsSnapshot = await this.permissionsCollection.where('sudoUserId', '==', doc.id).get();
            for (const pDoc of permsSnapshot.docs) {
                const perms = pDoc.data();
                if (perms.accessLevel === 'full') return { hasPermission: true };
                if (itemType === 'command' && perms.commands && perms.commands.includes(itemName)) return { hasPermission: true };
                if (itemType === 'feature' && perms.features && perms.features.includes(itemName)) return { hasPermission: true };
            }
        }
        return { hasPermission: false };
    }
}

export const sudoSystem = new SudoSystem();
