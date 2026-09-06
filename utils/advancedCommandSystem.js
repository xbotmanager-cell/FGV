import { db } from './firebaseAdmin.js';

class AdvancedCommandSystem {
    constructor() {
        this.commandsCol = db.collection('Commands');
        this.helpCol = db.collection('CommandHelp');
        this.personalityCol = db.collection('Personalities');
    }

    async saveCommandProfile(botId, name, category, profileData) {
        const data = { botId, name, category, ...profileData };
        const snapshot = await this.commandsCol.where('botId', '==', botId).where('name', '==', name).get();
        if (snapshot.empty) {
            await this.commandsCol.add(data);
        } else {
            await this.commandsCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async saveCommandHelp(commandId, explanation, instructions, features) {
        const snapshot = await this.helpCol.where('commandId', '==', commandId).get();
        const data = { commandId, explanation, instructions, features };
        if (snapshot.empty) {
            await this.helpCol.add(data);
        } else {
            await this.helpCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async savePersonalityResponse(commandId, personality, responseText) {
        const snapshot = await this.personalityCol.where('commandId', '==', commandId).where('personality', '==', personality).get();
        const data = { commandId, personality, responseText };
        if (snapshot.empty) {
            await this.personalityCol.add(data);
        } else {
            await this.personalityCol.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async getCommandInfo(botId, name) {
        const snapshot = await this.commandsCol.where('botId', '==', botId).where('name', '==', name).get();
        if (snapshot.empty) return null;
        
        const commandDoc = snapshot.docs[0];
        const commandData = commandDoc.data();
        
        const helpSnap = await this.helpCol.where('commandId', '==', commandDoc.id).get();
        const helpData = helpSnap.empty ? null : helpSnap.docs[0].data();
        
        return { ...commandData, help: helpData, id: commandDoc.id };
    }

    async getPersonalityResponse(commandId, personality) {
        const snapshot = await this.personalityCol.where('commandId', '==', commandId).where('personality', '==', personality).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data().responseText;
    }
}

export const advancedCommandSystem = new AdvancedCommandSystem();
