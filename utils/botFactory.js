import { db } from './firebaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';
import { modesEngine } from './modesEngine.js';

const PROJECTS_COLL = 'BotProjects';

class BotFactory {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Generate a unique ticket number
     */
    generateTicketNumber() {
        return `BOT-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    /**
     * Start a new bot project
     */
    async createProject(ownerJid, ownerNumber) {
        let ticketNumber = this.generateTicketNumber();
        // Ensure uniqueness
        while ((await db.collection(PROJECTS_COLL).doc(ticketNumber).get()).exists) {
            ticketNumber = this.generateTicketNumber();
        }

        const projectData = {
            ticketNumber,
            ownerJid,
            ownerNumber,
            status: 'draft', // draft, configuring, ready, deployed
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            config: {
                name: 'New Bot',
                bio: 'A simple mini bot',
                profileImageUrl: '',
                category: 'General',
                prefix: '.',
                suffix: '',
                commandMode: 'PREFIX', // PREFIX, PREFIXLESS, etc
                personalityId: 'default',
                enabledCommands: [], // if empty, all base commands allowed minus protected
                disabledCommands: [],
                aliases: {},
                messageStyle: 'BOX',
                permissions: 'PUBLIC'
            },
            version: '1.0.0',
            fingerprint: uuidv4()
        };

        await db.collection(PROJECTS_COLL).doc(ticketNumber).set(projectData);
        this.cache.set(ticketNumber, projectData);
        
        return projectData;
    }

    /**
     * Get a project by ticket number
     */
    async getProject(ticketNumber) {
        if (this.cache.has(ticketNumber)) return this.cache.get(ticketNumber);
        const doc = await db.collection(PROJECTS_COLL).doc(ticketNumber).get();
        if (doc.exists) {
            const data = doc.data();
            this.cache.set(ticketNumber, data);
            return data;
        }
        return null;
    }

    /**
     * Update project configuration
     */
    async updateProject(ticketNumber, updates) {
        const project = await this.getProject(ticketNumber);
        if (!project) return false;

        const updatedConfig = { ...project.config, ...updates };
        const payload = {
            config: updatedConfig,
            updatedAt: new Date().toISOString(),
            fingerprint: uuidv4() // Update fingerprint on config change
        };

        await db.collection(PROJECTS_COLL).doc(ticketNumber).update(payload);
        this.cache.set(ticketNumber, { ...project, ...payload });
        
        return this.cache.get(ticketNumber);
    }

    /**
     * Finalize and generate the bot deployment link
     */
    async finalizeProject(ticketNumber) {
        const project = await this.getProject(ticketNumber);
        if (!project) return null;

        await db.collection(PROJECTS_COLL).doc(ticketNumber).update({
            status: 'ready',
            updatedAt: new Date().toISOString()
        });

        // Generate mock deployment package URLs
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        return {
            dashboardUrl: `${appUrl}?ticket=${ticketNumber}`,
            downloadZipUrl: `${appUrl}/api/bots/download/${ticketNumber}`,
            githubForkUrl: `https://github.com/bunny-tech/master-bot/fork?ticket=${ticketNumber}`,
            fingerprint: project.fingerprint
        };
    }
    
    /**
     * Get all projects for an owner
     */
    async getProjectsByOwner(ownerNumber) {
        const snapshot = await db.collection(PROJECTS_COLL).where('ownerNumber', '==', ownerNumber).get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => doc.data());
    }
}

export const botFactory = new BotFactory();
