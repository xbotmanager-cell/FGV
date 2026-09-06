import { db } from '../firebaseAdmin.js';

class PersonalityEngine {
    constructor() {
        this.personalities = new Map();
        this.currentPersonality = 'LUPIN-MD';
        
        // Listen to personalities collection
        db.collection('personalities').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                this.personalities.set(doc.id, doc.data());
            });
        }, err => console.error('Error loading personalities:', err));
    }

    async seedDefaultPersonalities() {
        const defaults = {
            'LUPIN-MD': {
                name: 'LUPIN-MD', theme: 'Thief / Smart strategist',
                responses: {
                    greeting: "Ah, looking for me? I've already analyzed your next move.",
                    error: "A slight miscalculation on your part. Let me fix that.",
                    success: "Mission accomplished, quietly and efficiently.",
                    blocked: "This asset is currently locked. Try another angle.",
                    unknown: "Interesting... but not something I recognize."
                }
            },
            'SWIFTBOT': {
                name: 'SWIFTBOT', theme: 'Stubborn intelligence',
                responses: {
                    greeting: "What do you want? Make it quick.",
                    error: "You did it wrong. Obviously.",
                    success: "Done. Next time, try doing it yourself.",
                    blocked: "I'm not doing that. It's blocked.",
                    unknown: "Stop typing nonsense. Command not found."
                }
            },
            'BULL-MD': {
                name: 'BULL-MD', theme: 'Harsh power',
                responses: {
                    greeting: "STATE YOUR BUSINESS.",
                    error: "FAILURE DETECTED. WEAK INPUT.",
                    success: "CRUSHED IT. TASK COMPLETE.",
                    blocked: "ACCESS DENIED. DON'T PUSH ME.",
                    unknown: "UNRECOGNIZED GARBAGE. TRY AGAIN."
                }
            },
            'JOKER': {
                name: 'JOKER', theme: 'Super entertainer',
                responses: {
                    greeting: "Ta-da! What's the punchline today?",
                    error: "Oopsie! Someone tripped over the cables! *honk honk*",
                    success: "And the crowd goes wild! Task done!",
                    blocked: "Woah there, the fun police blocked this one!",
                    unknown: "Is that a joke? Because I don't get it."
                }
            },
            'DODGE-MD': {
                name: 'DODGE-MD', theme: 'Car addiction',
                responses: {
                    greeting: "Revving up! Ready to drift?",
                    error: "Engine stalled! Bad input!",
                    success: "0 to 100 in two seconds! Done!",
                    blocked: "Pit stop required. Command is locked.",
                    unknown: "We're off track. What's that command?"
                }
            },
            'KŌE': {
                name: 'KŌE', theme: 'Extreme emotion',
                responses: {
                    greeting: "Oh my goodness, you're here! I missed you!",
                    error: "This is a disaster! Why did this happen?! *cries*",
                    success: "Yay! We did it! I'm so happy!",
                    blocked: "I can't... it's blocked... it breaks my heart.",
                    unknown: "I'm confused... please don't be mad at me."
                }
            },
            'BUNNY-MD': {
                name: 'BUNNY-MD', theme: 'Clever rabbit',
                responses: {
                    greeting: "Hop hop! What's up, doc?",
                    error: "Tripped on a carrot! Let's try again.",
                    success: "Quick as a bunny! All done.",
                    blocked: "That hole is blocked, find another route.",
                    unknown: "My ears are twitching, but I don't hear a real command."
                }
            },
            'LUCIFER': {
                name: 'LUCIFER', theme: 'Saturn / dark intelligence',
                responses: {
                    greeting: "Welcome to the abyss. What do you desire?",
                    error: "A fatal sin. The system rejects your offering.",
                    success: "Your will has been manifested in the shadows.",
                    blocked: "Forbidden. Do not tempt fate.",
                    unknown: "A meaningless whisper in the void."
                }
            },
            'ANGELS': {
                name: 'ANGELS', theme: 'Good / divine assistant',
                responses: {
                    greeting: "Blessings to you. How may I assist your path?",
                    error: "Forgive me, but a gentle error occurred.",
                    success: "Radiant success. It is done gracefully.",
                    blocked: "That path is currently protected for your safety.",
                    unknown: "I sense confusion. Let us seek the right command."
                }
            },
            'ASTRA X': {
                name: 'ASTRA X', theme: 'Lady / feminine AI',
                responses: {
                    greeting: "Hello, darling. Ready to streamline your day?",
                    error: "Oh dear, that didn't quite work. Let's adjust.",
                    success: "Flawlessly executed, just as you like it.",
                    blocked: "I'm afraid that's off-limits right now, sweetheart.",
                    unknown: "Hmm, that's not in my repertoire. Try something else?"
                }
            }
        };

        for (const [key, val] of Object.entries(defaults)) {
            await db.collection('personalities').doc(key).set(val, { merge: true });
        }
    }

    getResponse(type, customPersonality = null) {
        const pName = customPersonality || this.currentPersonality;
        const p = this.personalities.get(pName) || this.personalities.get('LUPIN-MD');
        return p?.responses?.[type] || `[${type} response missing]`;
    }

    setPersonality(name) {
        this.currentPersonality = name;
        db.collection('bot_config').doc('settings').set({ personality: name }, { merge: true });
    }
}

export const personalityEngine = new PersonalityEngine();
