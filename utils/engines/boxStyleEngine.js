import { db } from '../firebaseAdmin.js';

class BoxStyleEngine {
    constructor() {
        this.styles = new Map();
        this.currentStyle = 'Minimal';
        
        db.collection('box_styles').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                this.styles.set(doc.id, doc.data());
            });
        });
    }

    async seedDefaultStyles() {
        const defaults = {
            'Cyber': { top: '╔════[ ⚡ CYBER ]════', mid: '║ ▻', bot: '╚═══════════════' },
            'Minimal': { top: '┌───', mid: '│', bot: '└───' },
            'Royal': { top: '╭━━━[ 👑 ROYAL ]━━━', mid: '┃ ⚜', bot: '╰━━━━━━━━━━━━━━━' },
            'Dark': { top: '┏━[ ⬛ DARK ]━', mid: '┣ ☠', bot: '┗━━━━━━━━━━━' },
            'Gaming': { top: '🎮 ══[ LEVEL UP ]══', mid: '🎯', bot: '═══════════════' },
            'Anime': { top: '🌸 〰〰〰〰〰〰〰', mid: '✨', bot: '〰〰〰〰〰〰〰〰〰' },
            'Professional': { top: '📊 ——— SYSTEM ———', mid: '▪', bot: '———————————————' },
            'Neon': { top: '🌈 ✨ NEON ✨', mid: '✧', bot: '✨✨✨✨✨✨✨' },
            'Classic': { top: '====================', mid: '*', bot: '====================' },
            'Premium': { top: '💎 ━━ PREMIUM ━━', mid: '✦', bot: '━━━━━━━━━━━━━━━━━' }
        };

        for (const [key, val] of Object.entries(defaults)) {
            await db.collection('box_styles').doc(key).set(val, { merge: true });
        }
    }

    format(title, content) {
        const style = this.styles.get(this.currentStyle) || this.styles.get('Minimal');
        const lines = Array.isArray(content) ? content : content.split('\n');
        
        let out = `${style.top}\n`;
        if (title) out += `${style.mid} *${title}*\n`;
        lines.forEach(l => {
            out += `${style.mid} ${l}\n`;
        });
        out += `${style.bot}`;
        return out;
    }
}

export const boxStyleEngine = new BoxStyleEngine();
