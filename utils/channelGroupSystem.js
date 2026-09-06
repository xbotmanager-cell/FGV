import { db } from './firebaseAdmin.js';

class ChannelGroupSystem {
    constructor() {
        this.channelCol = db.collection('Channels');
        this.groupCol = db.collection('Groups');
    }

    async setChannelConfig(botId, channelId, config) {
        const data = { botId, channelId, ...config, updatedAt: new Date().toISOString() };
        const snapshot = await this.channelCol.where('botId', '==', botId).where('channelId', '==', channelId).get();
        
        if (snapshot.empty) {
            await this.channelCol.add(data);
        } else {
            await this.channelCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async setGroupConfig(botId, groupId, config) {
        const data = { botId, groupId, ...config, updatedAt: new Date().toISOString() };
        const snapshot = await this.groupCol.where('botId', '==', botId).where('groupId', '==', groupId).get();
        
        if (snapshot.empty) {
            await this.groupCol.add(data);
        } else {
            await this.groupCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async getChannelConfig(botId, channelId) {
        const snapshot = await this.channelCol.where('botId', '==', botId).where('channelId', '==', channelId).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    }

    async getGroupConfig(botId, groupId) {
        const snapshot = await this.groupCol.where('botId', '==', botId).where('groupId', '==', groupId).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    }
}

export const channelGroupSystem = new ChannelGroupSystem();
