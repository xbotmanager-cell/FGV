import fs from 'fs';

let content = fs.readFileSync('index.js', 'utf8');

const regex = /if \(dynamicCommand\.execute\) \{([\s\S]*?)\} else \{ await handleDefaultCommands\(commandName, sock, msg, args, currentPrefix\); \}/m;

const replacement = `if (dynamicCommand) {
            try {
                const config = dynamicCommand.config || {};
                
                // 1. Check Permission
                const p = (config.permission || '').toLowerCase();
                const isOwner = jidManager.isOwner(msg);
                if ((p === 'owner' || p === 'admin' || p === 'sudo') && !isOwner) {
                    await sock.sendMessage(chatId, { text: '❌ *Access Denied: Owner Only*' });
                    return;
                }
                
                // 2. Add Reaction if configured
                if (config.reaction) {
                    try { await sock.sendMessage(chatId, { react: { text: config.reaction, key: msg.key } }); } catch (e) {}
                }
                
                // 3. Determine Personality Response
                // Pick a default personality if settings.personality is missing
                const selectedPersonality = settings.get('personality', 'LUPIN_MD').toUpperCase().replace('-', '_');
                let textResponse = config.responses?.[selectedPersonality] || config.description || 'Command executed.';
                
                // If it's a help command for a specific command
                if (commandName === 'help' && args.length > 0) {
                     const target = commandManager.findCommand(args[0], currentPrefix);
                     if (target && target.config) {
                         const tc = target.config;
                         const helpObj = tc.help || {};
                         textResponse = \`*\${(tc.name || '').toUpperCase()} COMMAND*\\n\\n1️⃣ **Overview:** \${helpObj.overview || tc.description}\\n2️⃣ **Usage:** \${helpObj.usage || tc.usage}\\n3️⃣ **Features:** \${(helpObj.features || []).join(', ')}\`;
                     } else {
                         textResponse = \`Command \${args[0]} not found.\`;
                     }
                }

                // Execute Base Command logic if available (for actual programmatic side effects)
                if (dynamicCommand.execute) {
                    const currentBotName = settings.get('botname', BOT_NAME);
                    await dynamicCommand.execute(sock, msg, args, currentPrefix, { response: textResponse, OWNER_NUMBER: OWNER_CLEAN_NUMBER, OWNER_JID: OWNER_CLEAN_JID, OWNER_LID, BOT_NAME: currentBotName, VERSION, isOwner: () => isOwner, jidManager, store, statusDetector, updatePrefix: updatePrefixImmediately, getCurrentPrefix, rateLimiter, memberDetector, isPrefixless, commands, BOT_MODE });
                } else if (config.media && config.media.url) {
                    // Send media if configured
                    if (config.media.type === 'image') {
                        await sock.sendMessage(chatId, { image: { url: config.media.url }, caption: config.media.caption || textResponse });
                    } else if (config.media.type === 'video') {
                        await sock.sendMessage(chatId, { video: { url: config.media.url }, caption: config.media.caption || textResponse });
                    } else if (config.media.type === 'audio') {
                        await sock.sendMessage(chatId, { audio: { url: config.media.url }, mimetype: 'audio/mp4', ptt: true });
                    } else {
                        await sock.sendMessage(chatId, { document: { url: config.media.url }, mimetype: 'application/octet-stream', fileName: 'file', caption: config.media.caption || textResponse });
                    }
                } else {
                    // Static text response
                    await sock.sendMessage(chatId, { text: textResponse });
                }
            } catch (error) { UltraCleanLogger.error(\`Command \${commandName} failed: \${error.message}\`); }
        } else { await handleDefaultCommands(commandName, sock, msg, args, currentPrefix); }`;

content = content.replace(regex, replacement);
fs.writeFileSync('index.js', content);
