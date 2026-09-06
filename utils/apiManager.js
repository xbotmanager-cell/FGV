import { db } from './firebaseAdmin.js';

class ApiManager {
    constructor() {
        this.providersCol = db.collection('APIProviders');
        this.fallbackRulesCol = db.collection('FallbackRules');
        this.logsCol = db.collection('APIUsageLogs');
        this.providersCache = [];
        this.initListeners();
    }

    initListeners() {
        this.providersCol.onSnapshot(snapshot => {
            this.providersCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
    }

    async addProvider(name, service, apiKey, status, priority, usageLimits) {
        const data = {
            name, service, apiKey, status, priority, usageLimits,
            failureCount: 0,
            updatedAt: new Date().toISOString()
        };
        const ref = await this.providersCol.add(data);
        return { success: true, providerId: ref.id };
    }

    async updateProviderStatus(providerId, status) {
        await this.providersCol.doc(providerId).update({ status, updatedAt: new Date().toISOString() });
        return { success: true };
    }

    async logUsage(providerId, service, success) {
        await this.logsCol.add({
            providerId, service, success, createdAt: new Date().toISOString()
        });
        
        if (!success) {
            const provider = this.providersCache.find(p => p.id === providerId);
            if (provider) {
                await this.providersCol.doc(providerId).update({ failureCount: (provider.failureCount || 0) + 1 });
            }
        }
    }

    async getProvidersForService(service) {
        const providers = this.providersCache
            .filter(p => p.service === service && p.status !== 'disabled')
            .sort((a, b) => a.priority - b.priority); // Lower number = higher priority
            
        return providers;
    }

    async executeWithFallback(service, requestFunction) {
        const providers = await this.getProvidersForService(service);
        if (providers.length === 0) {
            throw new Error(`No active providers found for service: ${service}`);
        }

        let lastError = null;

        for (const provider of providers) {
            try {
                // Execute the request using this provider's API key
                const result = await requestFunction(provider.apiKey);
                await this.logUsage(provider.id, service, true);
                return result; // Success!
            } catch (error) {
                lastError = error;
                await this.logUsage(provider.id, service, false);
                // Switch automatically to the next provider in the loop
            }
        }

        throw new Error(`All providers for ${service} failed. Last error: ${lastError.message}`);
    }
}

export const apiManager = new ApiManager();
