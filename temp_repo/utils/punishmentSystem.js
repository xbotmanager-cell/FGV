import groupSettings from './groupSettings.js';

class PunishmentSystem {
    async executePunishment(sock, msg, groupId, senderJid, ruleName) {
        const action = groupSettings.get(groupId, `${ruleName}_action`, 'warn');
        if (action === 'ignore' || action === 'log') return;

        try {
            if (action === 'delete') {
                if (msg.key) {
                    await sock.sendMessage(groupId, { delete: msg.key });
                }
            } else if (action === 'warn') {
                if (msg.key) {
                    await sock.sendMessage(groupId, { delete: msg.key });
                }
                await sock.sendMessage(groupId, { text: `⚠️ @${senderJid.split('@')[0]}, you violated the ${ruleName} rule!`, mentions: [senderJid] });
            } else if (action === 'kick') {
                if (msg.key) {
                    await sock.sendMessage(groupId, { delete: msg.key });
                }
                await sock.groupParticipantsUpdate(groupId, [senderJid], 'remove');
                await sock.sendMessage(groupId, { text: `🚫 @${senderJid.split('@')[0]} was kicked for violating the ${ruleName} rule.`, mentions: [senderJid] });
            } else if (action === 'mute') {
                if (msg.key) {
                    await sock.sendMessage(groupId, { delete: msg.key });
                }
                // In Baileys, there's no direct "mute" user unless it's an admin removing sending permissions from all, 
                // but we can just warn and if they repeat, kick.
                await sock.sendMessage(groupId, { text: `🔇 @${senderJid.split('@')[0]} has been warned (Mute action selected).`, mentions: [senderJid] });
            } else if (action === 'ban') {
                if (msg.key) {
                    await sock.sendMessage(groupId, { delete: msg.key });
                }
                await sock.groupParticipantsUpdate(groupId, [senderJid], 'remove');
                await sock.sendMessage(groupId, { text: `🔨 @${senderJid.split('@')[0]} was banned for violating the ${ruleName} rule.`, mentions: [senderJid] });
            }
        } catch (error) {
            console.error(`Failed to execute punishment for ${ruleName}: ${error.message}`);
        }
    }
}

const punishmentSystem = new PunishmentSystem();
export default punishmentSystem;
