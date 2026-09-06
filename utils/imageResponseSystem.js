import { db } from './firebaseAdmin.js';

class ImageResponseSystem {
    constructor() {
        this.collection = db.collection('ImageTemplates');
    }

    async saveTemplate(botId, name, type, config) {
        const data = {
            botId,
            name,
            type, // card, box, profile, announcement
            config: JSON.stringify(config),
            status: 'active'
        };
        const ref = await this.collection.add(data);
        return { success: true, templateId: ref.id };
    }

    async toggleTemplate(templateId, status) {
        await this.collection.doc(templateId).update({ status });
        return { success: true };
    }

    async generateImageFromText(botId, text, type) {
        // Fast lightweight rendering logic checking template configuration
        const snapshot = await this.collection
            .where('botId', '==', botId)
            .where('type', '==', type)
            .where('status', '==', 'active')
            .limit(1)
            .get();
            
        let templateConfig = {};
        if (!snapshot.empty) {
            templateConfig = JSON.parse(snapshot.docs[0].data().config || '{}');
        }

        // Normally, this would use a fast canvas alternative or API like html-to-image or similar headless lightweight builder.
        // For architectural purpose, returns simulated generation.
        const mockImageUrl = `https://dummyimage.com/600x400/${templateConfig.bgColor || '0f172a'}/${templateConfig.textColor || 'ffffff'}&text=${encodeURIComponent(text.substring(0, 50))}`;
        
        return { success: true, imageUrl: mockImageUrl };
    }
}

export const imageResponseSystem = new ImageResponseSystem();
