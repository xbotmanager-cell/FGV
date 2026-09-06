import fs from 'fs';
let content = fs.readFileSync('utils/commandManager.js', 'utf8');

content = content.replace(
    /registerBaseCommand\(command\) \{([\s\S]*?)db\.collection\('commands'\)\.doc\(originalName\)\.get\(\)\.then\(doc => \{([\s\S]*?)\}\);/g,
    `async registerBaseCommand(command) {
        if (!command || !command.name) return;
        const originalName = command.name.toLowerCase();
        this.baseCommands.set(originalName, command);
        
        try {
            const doc = await db.collection('commands').doc(originalName).get();
            if (!doc.exists || !doc.data().responses) {
                await this.addCommand({
                    name: command.name,
                    aliases: command.aliases || [],
                    category: command.category || 'general',
                    description: command.description || '',
                    usage: command.usage || \`.\${command.name}\`,
                    permission: command.permission || 'Public',
                    reaction: command.reaction || '✅',
                    enabled: command.enabled !== false,
                    responses: command.responses || {
                        LUPIN_MD: "Lupin response",
                        SWIFTBOT: "Swiftbot response",
                        BULL_MD: "Bull response",
                        JOKER: "Joker response",
                        DODGE_MD: "Dodge response",
                        KOE: "Koe response",
                        BUNNY_MD: "Bunny response",
                        LUCIFER: "Lucifer response",
                        ANGELS: "Angels response",
                        ASTRA_X: "Astra X response"
                    },
                    help: command.help || { overview: command.description, usage: \`.\${command.name}\`, features: [] },
                    media: command.media || { type: "text", url: "", caption: "" },
                    logs: [],
                    version: 1
                }, 'System Initialization');
            }
        } catch (e) {
            console.error('Failed to register base command', command.name, e);
        }`
);

fs.writeFileSync('utils/commandManager.js', content);
