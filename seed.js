import { personalityEngine } from './utils/engines/personalityEngine.js';
import { boxStyleEngine } from './utils/engines/boxStyleEngine.js';
import { db } from './utils/firebaseAdmin.js';

async function seed() {
    console.log('Seeding personalities...');
    await personalityEngine.seedDefaultPersonalities();
    console.log('Seeding box styles...');
    await boxStyleEngine.seedDefaultStyles();
    
    // Seed Bot Profiles
    console.log('Seeding default bot profiles...');
    const bots = [
        { id: 'LUPIN-MD', name: 'LUPIN-MD', personality: 'LUPIN-MD', style: 'Cyber', bio: 'Thief / Smart strategist' },
        { id: 'SWIFTBOT', name: 'SWIFTBOT', personality: 'SWIFTBOT', style: 'Minimal', bio: 'Stubborn intelligence' },
        { id: 'BULL-MD', name: 'BULL-MD', personality: 'BULL-MD', style: 'Dark', bio: 'Harsh power' },
        { id: 'JOKER', name: 'JOKER', personality: 'JOKER', style: 'Neon', bio: 'Super entertainer' },
        { id: 'DODGE-MD', name: 'DODGE-MD', personality: 'DODGE-MD', style: 'Gaming', bio: 'Car addiction' },
        { id: 'KŌE', name: 'KŌE', personality: 'KŌE', style: 'Anime', bio: 'Extreme emotion' },
        { id: 'BUNNY-MD', name: 'BUNNY-MD', personality: 'BUNNY-MD', style: 'Classic', bio: 'Clever rabbit' },
        { id: 'LUCIFER', name: 'LUCIFER', personality: 'LUCIFER', style: 'Dark', bio: 'Saturn / dark intelligence' },
        { id: 'ANGELS', name: 'ANGELS', personality: 'ANGELS', style: 'Premium', bio: 'Good / divine assistant' },
        { id: 'ASTRA X', name: 'ASTRA X', personality: 'ASTRA X', style: 'Royal', bio: 'Lady / feminine AI' }
    ];

    for (const b of bots) {
        await db.collection('bot_profiles').doc(b.id).set(b, { merge: true });
    }

    console.log('Seeding complete.');
    process.exit(0);
}
seed();
