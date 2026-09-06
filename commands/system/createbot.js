export default {
    name: 'createbot',
    alias: ['create', 'newbot', 'botfactory'],
    category: 'system',
    description: 'Start the Simplified Developer Bot Creation System to create a new mini bot.',
    ownerOnly: false,
    async execute(sock, msg, args, prefix, context) {
        const { isOwner, updatePrefix, getCurrentPrefix, isPrefixless } = context;
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const chatId = msg.key.remoteJid;
        
        try {
            // Check if user is starting a new project
            if (args.length === 0) {
                // Dynamically import the factory
                const { botFactory } = await import('../../utils/botFactory.js');
                
                // Get clean number
                const cleanNumber = senderJid.split('@')[0].split(':')[0];
                
                await sock.sendMessage(chatId, { text: `⚙️ *INITIALIZING BOT FACTORY...*\n\nPlease wait while we allocate resources for your new Bot Project...` }, { quoted: msg });
                
                const project = await botFactory.createProject(senderJid, cleanNumber);
                
                const appUrl = process.env.APP_URL || 'http://localhost:3000';
                
                let reply = `✅ *BOT PROJECT CREATED!*\n\n`;
                reply += `🎫 *Ticket Number:* \`${project.ticketNumber}\`\n`;
                reply += `🔑 *Fingerprint:* ${project.fingerprint.substring(0, 8)}\n\n`;
                reply += `╭━━━〔 🛠️ CONFIGURATION 〕━━━╮\n`;
                reply += `┃ You can configure your bot via:\n`;
                reply += `┃ 1. *WhatsApp:* Reply with \`${prefix || '.'}createbot config ${project.ticketNumber}\`\n`;
                reply += `┃ 2. *Web Dashboard:* ${appUrl}?ticket=${project.ticketNumber}\n`;
                reply += `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
                reply += `Use the Web Dashboard for a full Vercel-like visual builder experience!`;
                
                await sock.sendMessage(chatId, { text: reply });
                return;
            }
            
            // Handle configuration steps via WhatsApp
            const action = args[0]?.toLowerCase();
            const ticket = args[1]?.toUpperCase();
            
            if (action === 'config' && ticket) {
                 const { botFactory } = await import('../../utils/botFactory.js');
                 const project = await botFactory.getProject(ticket);
                 if (!project) {
                     await sock.sendMessage(chatId, { text: `❌ *Error:* Project ${ticket} not found.` });
                     return;
                 }
                 
                 // Show current config and instructions
                 let configMsg = `🛠️ *PROJECT CONFIGURATION - ${ticket}*\n\n`;
                 configMsg += `*Name:* ${project.config.name}\n`;
                 configMsg += `*Prefix:* ${project.config.prefix}\n`;
                 configMsg += `*Mode:* ${project.config.commandMode}\n`;
                 configMsg += `*Style:* ${project.config.messageStyle}\n`;
                 configMsg += `*Personality:* ${project.config.personalityId}\n\n`;
                 
                 configMsg += `To change a setting, use:\n\`${prefix || '.'}createbot set ${ticket} <key> <value>\`\n\n`;
                 configMsg += `Example:\n\`${prefix || '.'}createbot set ${ticket} name MyAwesomeBot\``;
                 
                 await sock.sendMessage(chatId, { text: configMsg });
            } else if (action === 'set' && ticket && args[2]) {
                 const key = args[2].toLowerCase();
                 const value = args.slice(3).join(' ');
                 
                 const { botFactory } = await import('../../utils/botFactory.js');
                 
                 // Map keys to config
                 const allowedKeys = ['name', 'bio', 'prefix', 'mode', 'personality', 'style'];
                 const keyMap = { mode: 'commandMode', personality: 'personalityId', style: 'messageStyle' };
                 
                 if (!allowedKeys.includes(key)) {
                     await sock.sendMessage(chatId, { text: `❌ Invalid key. Allowed: ${allowedKeys.join(', ')}` });
                     return;
                 }
                 
                 const configKey = keyMap[key] || key;
                 await botFactory.updateProject(ticket, { [configKey]: value });
                 
                 await sock.sendMessage(chatId, { text: `✅ Setting *${configKey}* updated to *${value}* for project ${ticket}.` });
            } else if (action === 'build' && ticket) {
                 const { botFactory } = await import('../../utils/botFactory.js');
                 const result = await botFactory.finalizeProject(ticket);
                 
                 if (!result) {
                     await sock.sendMessage(chatId, { text: `❌ *Error:* Project ${ticket} not found.` });
                     return;
                 }
                 
                 let buildMsg = `🚀 *BOT BUILT SUCCESSFULLY!*\n\n`;
                 buildMsg += `🎫 *Ticket:* ${ticket}\n`;
                 buildMsg += `🔑 *Fingerprint:* ${result.fingerprint}\n\n`;
                 buildMsg += `╭━━━〔 📦 DEPLOYMENT 〕━━━╮\n`;
                 buildMsg += `┃ 🌐 *Dashboard:* ${result.dashboardUrl}\n`;
                 buildMsg += `┃ 📥 *ZIP:* ${result.downloadZipUrl}\n`;
                 buildMsg += `┃ 🐙 *GitHub:* ${result.githubForkUrl}\n`;
                 buildMsg += `╰━━━━━━━━━━━━━━━━━━━╯`;
                 
                 await sock.sendMessage(chatId, { text: buildMsg });
            } else {
                await sock.sendMessage(chatId, { text: `❌ Invalid action. Use \`${prefix || '.'}createbot\` to start.` });
            }
            
        } catch (error) {
            console.error('CreateBot Command Error:', error);
            await sock.sendMessage(chatId, { text: `❌ An error occurred: ${error.message}` });
        }
    }
};
