import { db } from './firebaseAdmin.js';

class MenuSystem {
    constructor() {
        this.collection = db.collection('Menus');
    }

    async saveMenuConfig(botId, config) {
        const data = { botId, status: 'active', ...config };
        const snapshot = await this.collection.where('botId', '==', botId).get();
        if (snapshot.empty) {
            await this.collection.add(data);
        } else {
            await this.collection.doc(snapshot.docs[0].id).update(data);
        }
        return { success: true };
    }

    async getMenuConfig(botId) {
        const snapshot = await this.collection.where('botId', '==', botId).where('status', '==', 'active').get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    }

    generateMenu(commandsList, config, page = 1) {
        if (!config) {
            config = { style: 'boxless', displayOption: 'commands', paginationLimit: 50 };
        }
        
        const limit = config.paginationLimit || 50;
        const totalPages = Math.ceil(commandsList.length / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const pageCommands = commandsList.slice(start, end);

        let menuText = config.header ? `${config.header}\n\n` : '';
        menuText += `Page ${page}/${totalPages}\n\n`;

        pageCommands.forEach(cmd => {
            let line = '';
            if (config.displayOption === 'commands') line = `${cmd.name}`;
            else if (config.displayOption === 'aliases') line = `${(cmd.aliases || []).join(', ')}`;
            else line = `${cmd.name} (${(cmd.aliases || []).join(', ')})`;
            
            if (config.style === 'box') {
                menuText += `[+] ${line}\n`;
            } else {
                menuText += `${line}\n`;
            }
        });

        if (config.footer) menuText += `\n${config.footer}`;
        return menuText;
    }
}

export const menuSystem = new MenuSystem();
