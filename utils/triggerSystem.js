import { db } from './firebaseAdmin.js';

class TriggerSystem {
    constructor() {
        this.collection = db.collection('Triggers');
    }

    async createTrigger(botId, eventType, conditions, actionType, actionPayload) {
        const triggerData = {
            botId,
            eventType,
            conditions: JSON.stringify(conditions),
            actionType,
            actionPayload: JSON.stringify(actionPayload),
            status: 'active',
            createdAt: new Date().toISOString()
        };
        const ref = await this.collection.add(triggerData);
        return { success: true, triggerId: ref.id };
    }

    async toggleTrigger(triggerId, status) {
        await this.collection.doc(triggerId).update({ status });
        return { success: true };
    }

    async processEvent(botId, eventType, eventData, executeActionCallback) {
        const snapshot = await this.collection
            .where('botId', '==', botId)
            .where('eventType', '==', eventType)
            .where('status', '==', 'active')
            .get();

        if (snapshot.empty) return;

        for (const doc of snapshot.docs) {
            const trigger = doc.data();
            const conditions = JSON.parse(trigger.conditions || '{}');
            const payload = JSON.parse(trigger.actionPayload || '{}');
            
            // Check conditions (simplified logic, real logic would evaluate conditions against eventData)
            let conditionsMet = true; 
            for (const key in conditions) {
                if (eventData[key] !== conditions[key]) {
                    conditionsMet = false;
                    break;
                }
            }

            if (conditionsMet) {
                await executeActionCallback(trigger.actionType, payload, eventData);
            }
        }
    }
}

export const triggerSystem = new TriggerSystem();
