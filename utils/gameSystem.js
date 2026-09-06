import { db } from './firebaseAdmin.js';

class GameSystem {
    constructor() {
        this.gamesCollection = db.collection('Games');
        this.leaderboardsCollection = db.collection('Leaderboards');
        this.giveawaysCollection = db.collection('Giveaways');
    }

    async toggleGameModule(botId, gameType, status, config = {}) {
        const snapshot = await this.gamesCollection.where('botId', '==', botId).where('gameType', '==', gameType).get();
        if (snapshot.empty) {
            await this.gamesCollection.add({ botId, gameType, status, config: JSON.stringify(config) });
        } else {
            const docId = snapshot.docs[0].id;
            await this.gamesCollection.doc(docId).update({ status, config: JSON.stringify(config) });
        }
        return { success: true };
    }

    async updateScore(botId, userId, points, winsIncrement = 0) {
        const periods = ['daily', 'weekly', 'monthly', 'all_time'];
        const batch = db.batch();
        
        for (const period of periods) {
            const snapshot = await this.leaderboardsCollection
                .where('botId', '==', botId)
                .where('userId', '==', userId)
                .where('period', '==', period)
                .get();
                
            if (snapshot.empty) {
                const ref = this.leaderboardsCollection.doc();
                batch.set(ref, { botId, userId, score: points, wins: winsIncrement, activity: 1, points, period, updatedAt: new Date().toISOString() });
            } else {
                const doc = snapshot.docs[0];
                const current = doc.data();
                batch.update(doc.ref, { 
                    score: (current.score || 0) + points,
                    wins: (current.wins || 0) + winsIncrement,
                    activity: (current.activity || 0) + 1,
                    points: (current.points || 0) + points,
                    updatedAt: new Date().toISOString()
                });
            }
        }
        await batch.commit();
        return { success: true };
    }

    async createGiveaway(botId, title, reward, endDate) {
        const giveawayData = {
            botId, title, reward,
            participants: [],
            winner: null,
            status: 'active',
            endDate,
            createdAt: new Date().toISOString()
        };
        const ref = await this.giveawaysCollection.add(giveawayData);
        return { success: true, giveawayId: ref.id };
    }

    async joinGiveaway(giveawayId, userId) {
        const doc = await this.giveawaysCollection.doc(giveawayId).get();
        if (!doc.exists) return { success: false, error: 'Giveaway not found' };
        
        const data = doc.data();
        if (data.status !== 'active') return { success: false, error: 'Giveaway not active' };
        
        const participants = data.participants || [];
        if (!participants.includes(userId)) {
            participants.push(userId);
            await doc.ref.update({ participants });
        }
        return { success: true };
    }

    async pickWinner(giveawayId) {
        const doc = await this.giveawaysCollection.doc(giveawayId).get();
        if (!doc.exists) return { success: false, error: 'Giveaway not found' };
        
        const data = doc.data();
        if (data.status !== 'active') return { success: false, error: 'Giveaway already completed' };
        
        const participants = data.participants || [];
        if (participants.length === 0) return { success: false, error: 'No participants' };
        
        const winner = participants[Math.floor(Math.random() * participants.length)];
        await doc.ref.update({ winner, status: 'completed' });
        
        return { success: true, winner };
    }
}

export const gameSystem = new GameSystem();
