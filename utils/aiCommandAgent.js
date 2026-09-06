import { GoogleGenAI, Type } from '@google/genai';
import { commandManager } from './commandManager.js';
import { modesEngine } from './modesEngine.js';
import { botFactory } from './botFactory.js';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const systemPrompt = `You are an expert WhatsApp Bot Administrator AI Agent.
Your job is to manage the Dynamic Command Management System, the Bot Modes Engine, and the Bot Factory (mini bot creation system).
You can execute tools to read, rename, disable, restore, and alias commands dynamically.
You can change the bot's mode (e.g. prefix, prefixless, public, owner_only, etc.) using the setMode tool.
You can also help users configure their mini bots using configureBotProject.
Explain your actions concisely. Do not require the user to restart the bot.`;

export async function processAiAdminCommand(prompt, user) {
    try {
        // Prepare personality info
        const userConfig = await modesEngine.loadUserConfig(user) || {};
        const activePersonality = modesEngine.getPersonality(user);
        
        const tools = [{
            functionDeclarations: [
                {
                    name: 'renameCommand',
                    description: 'Rename a command to a new name. E.g., change download to save.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            oldName: { type: Type.STRING },
                            newName: { type: Type.STRING }
                        },
                        required: ['oldName', 'newName']
                    }
                },
                {
                    name: 'addAlias',
                    description: 'Add an alias to a command. E.g., make dl an alias for download.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            commandName: { type: Type.STRING },
                            alias: { type: Type.STRING }
                        },
                        required: ['commandName', 'alias']
                    }
                },
                {
                    name: 'restoreCommand',
                    description: 'Restore a command to its original default name.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: { commandName: { type: Type.STRING } },
                        required: ['commandName']
                    }
                },
                {
                    name: 'toggleCommand',
                    description: 'Enable or disable a command.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            commandName: { type: Type.STRING },
                            status: { type: Type.STRING, description: 'Must be enabled or disabled' }
                        },
                        required: ['commandName', 'status']
                    }
                },
                {
                    name: 'setMode',
                    description: 'Change the bot modes engine configuration.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, description: 'Category of mode: messageFormat, botAccess, personality, deployment' },
                            key: { type: Type.STRING, description: 'Key to change (e.g., mode, prefix, suffix, activePersonalityId)' },
                            value: { type: Type.STRING, description: 'New value' }
                        },
                        required: ['category', 'key', 'value']
                    }
                },
                {
                    name: 'configureBotProject',
                    description: 'Configure a mini bot project created by the user in the Bot Factory.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            ticketNumber: { type: Type.STRING, description: 'The ticket number of the bot project (e.g. BOT-12345)' },
                            key: { type: Type.STRING, description: 'The configuration key to update (e.g. name, bio, prefix, commandMode, personalityId)' },
                            value: { type: Type.STRING, description: 'The new value for the configuration key' }
                        },
                        required: ['ticketNumber', 'key', 'value']
                    }
                }
            ]
        }];

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `[Personality: ${activePersonality.name}, Mood: ${activePersonality.mood}, Style: ${activePersonality.replyStyle}]\n\nUser request: ${prompt}`,
            config: { systemInstruction: systemPrompt, tools }
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];
            const args = call.args;
            let resultMessage = '';

            if (call.name === 'renameCommand') {
                const success = await commandManager.renameCommand(args.oldName, args.newName, `AI Agent (${user})`);
                resultMessage = success ? `Successfully renamed ${args.oldName} to ${args.newName}.` : `Failed to find command ${args.oldName}.`;
            } else if (call.name === 'addAlias') {
                const success = await commandManager.addAlias(args.commandName, args.alias, `AI Agent (${user})`);
                resultMessage = success ? `Added alias ${args.alias} to ${args.commandName}.` : `Failed to find command ${args.commandName}.`;
            } else if (call.name === 'restoreCommand') {
                const success = await commandManager.restoreCommand(args.commandName, `AI Agent (${user})`);
                resultMessage = success ? `Restored ${args.commandName} to its original state.` : `Failed to restore command ${args.commandName}.`;
            } else if (call.name === 'toggleCommand') {
                await commandManager.updateCommand(args.commandName, { status: args.status }, `AI Agent (${user})`);
                resultMessage = `Command ${args.commandName} is now ${args.status}.`;
            } else if (call.name === 'setMode') {
                await modesEngine.setMode(args.category, args.key, args.value);
                resultMessage = `Mode successfully updated: [${args.category}] ${args.key} = ${args.value}.`;
            } else if (call.name === 'configureBotProject') {
                const success = await botFactory.updateProject(args.ticketNumber, { [args.key]: args.value });
                resultMessage = success ? `Successfully updated bot project ${args.ticketNumber}: ${args.key} = ${args.value}.` : `Failed to update bot project ${args.ticketNumber}.`;
            }

            return resultMessage;
        }

        return response.text;
    } catch (e) {
        console.error('[AI AGENT] Error:', e);
        return 'I encountered an error while processing that command.';
    }
}
