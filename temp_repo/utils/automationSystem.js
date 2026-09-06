import groupSettings from './groupSettings.js';
import punishmentSystem from './punishmentSystem.js';

class AutomationSystem {
    constructor() {
        this.messageCounts = {}; // For Anti Flood
    }

    async handleMessage(sock, msg) {
        if (!msg.key.remoteJid.endsWith('@g.us')) return false;
        if (msg.key.fromMe) return false;

        const groupId = msg.key.remoteJid;
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const textMsg = msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || '';

        const isGroupActive = groupSettings.settings[groupId];
        if (!isGroupActive) return false;

        let isAdmin = false;
        try {
            const groupMetadata = await sock.groupMetadata(groupId);
            const participants = groupMetadata.participants;
            const adminList = participants.filter(p => p.admin !== null).map(p => p.id);
            isAdmin = adminList.includes(senderJid);
        } catch (e) {}

        const checkProtection = async (ruleName, condition) => {
            if (groupSettings.get(groupId, `${ruleName}_enabled`, false)) {
                const exemptAdmins = groupSettings.get(groupId, `${ruleName}_exempt_admins`, true);
                if (!(exemptAdmins && isAdmin)) {
                    if (condition) {
                        await punishmentSystem.executePunishment(sock, msg, groupId, senderJid, ruleName);
                        return true;
                    }
                }
            }
            return false;
        };

        // Anti Flood
        if (groupSettings.get(groupId, 'antiflood_enabled', false)) {
            const exemptAdmins = groupSettings.get(groupId, 'antiflood_exempt_admins', true);
            if (!(exemptAdmins && isAdmin)) {
                const userKey = `${groupId}-${senderJid}`;
                const now = Date.now();
                if (!this.messageCounts[userKey]) this.messageCounts[userKey] = [];
                this.messageCounts[userKey].push(now);
                this.messageCounts[userKey] = this.messageCounts[userKey].filter(t => now - t < 5000); // 5 seconds window
                if (this.messageCounts[userKey].length > 5) {
                    await punishmentSystem.executePunishment(sock, msg, groupId, senderJid, 'antiflood');
                    this.messageCounts[userKey] = [];
                    return true;
                }
            }
        }

        // Text Content Protections
        if (textMsg) {
            if (await checkProtection('antilink', textMsg.match(/chat\.whatsapp\.com\/[a-zA-Z0-9]+/i))) return true;
            if (await checkProtection('antispam', textMsg.length > 3000)) return true;
            
            const lowerMsg = textMsg.toLowerCase();
            const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick'];
            if (await checkProtection('antitoxic', badWords.some(word => lowerMsg.includes(word)))) return true;
            
            if (await checkProtection('antiadvertisement', lowerMsg.includes('buy now') || lowerMsg.includes('discount') || lowerMsg.includes('subscribe'))) return true;
            if (await checkProtection('antiphishing', textMsg.match(/https?:\/\/[^\s]+(?:free|gift|nitro|robux)[^\s]+/i))) return true;
            if (await checkProtection('antitaggall', textMsg.includes('@all') || textMsg.includes('@everyone'))) return true;
            if (await checkProtection('anticapslock', textMsg === textMsg.toUpperCase() && textMsg.length > 20 && /[A-Z]/.test(textMsg))) return true;
        }

        // Sender Protections
        if (await checkProtection('antifake', senderJid.startsWith('212') || senderJid.startsWith('234'))) return true;
        if (await checkProtection('antibot', msg.key.id.startsWith('BAE5') || msg.key.id.length === 16)) return true; // Baileys bot ID signature

        // Message Type Protections
        const messageType = Object.keys(msg.message || {})[0];
        if (await checkProtection('antisticker', messageType === 'stickerMessage')) return true;
        if (await checkProtection('antiimage', messageType === 'imageMessage')) return true;
        if (await checkProtection('antivideo', messageType === 'videoMessage')) return true;
        if (await checkProtection('antiaudio', messageType === 'audioMessage')) return true;
        if (await checkProtection('antidocument', messageType === 'documentMessage')) return true;
        if (await checkProtection('anticontact', messageType === 'contactMessage' || messageType === 'contactsArrayMessage')) return true;
        if (await checkProtection('antiviewonce', messageType === 'viewOnceMessage' || messageType === 'viewOnceMessageV2')) return true;
        if (await checkProtection('antivir', messageType === 'documentMessage' && msg.message?.documentMessage?.mimetype === 'application/x-dosexec')) return true;
        if (await checkProtection('antiaik', messageType === 'documentMessage' && msg.message?.documentMessage?.mimetype === 'application/vnd.android.package-archive')) return true;

        // Context Info Protections
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo || msg.message?.[messageType]?.contextInfo;
        if (contextInfo) {
            if (await checkProtection('antimention', (contextInfo.mentionedJid || []).length > 5)) return true;
            if (await checkProtection('antiforward', contextInfo.isForwarded)) return true;
        }

        // Auto Reply / Translation / AI moderation could go here (if enabled, process and return false to allow command processing)
        if (groupSettings.get(groupId, 'autoreply_enabled', false)) {
            // Very simple auto-reply logic for common greetings
            const lowerMsg = textMsg.toLowerCase();
            if (lowerMsg === 'hi' || lowerMsg === 'hello' || lowerMsg === 'ping') {
                await sock.sendMessage(groupId, { text: 'Hello! This is an automated reply.', mentions: [senderJid] }, { quoted: msg });
            }
        }

        return false;
    }

    async handleGroupParticipantsUpdate(sock, { id, participants, action }) {
        if (!id.endsWith('@g.us')) return;
        const groupId = id;

        // Auto Welcome
        if (action === 'add' && groupSettings.get(groupId, 'autowelcome_enabled', false)) {
            for (const p of participants) {
                const text = `👋 Welcome to the group, @${p.split('@')[0]}!`;
                await sock.sendMessage(groupId, { text, mentions: [p] });
            }
        }

        // Auto Goodbye
        if (action === 'remove' && groupSettings.get(groupId, 'autogoodbye_enabled', false)) {
            for (const p of participants) {
                const text = `👋 @${p.split('@')[0]} left the group. Goodbye!`;
                await sock.sendMessage(groupId, { text, mentions: [p] });
            }
        }

        // Anti Promote
        if (action === 'promote' && groupSettings.get(groupId, 'antipromote_enabled', false)) {
            for (const p of participants) {
                await sock.groupParticipantsUpdate(groupId, [p], 'demote');
                await sock.sendMessage(groupId, { text: `🛡️ Anti-Promote is enabled. @${p.split('@')[0]} has been demoted back.`, mentions: [p] });
            }
        }
        
        // Anti Demote (We skip doing it here if it exists in commands, but we implement basic if requested)
    }
}

const automationSystem = new AutomationSystem();
export default automationSystem;
