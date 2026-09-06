import re

with open('index.js', 'r') as f:
    content = f.read()

# Add import for registerSystemCommands
import_sys_cmds = "import registerSystemCommands from './plugins/system_commands.js';\n"
if "registerSystemCommands" not in content:
    content = content.replace("import { jidManager } from './utils/jidManager.js';", "import { jidManager } from './utils/jidManager.js';\n" + import_sys_cmds)

# Call registerSystemCommands inside main() before startBot
if "registerSystemCommands();" not in content:
    content = content.replace("const loginManager = new LoginManager();", "registerSystemCommands();\n        const loginManager = new LoginManager();")

# Inject personality / blocked status checking into the message handler
# Look around line 1251 where dynamicCommand is resolved
handler_patch = """
        const dynamicCommand = commandManager.findCommand(textMsg, senderJid);
        
        if (dynamicCommand) {
            // Check for Blocked Status
            if (dynamicCommand.status === 'blocked') {
                const pResp = await import('./utils/engines/personalityEngine.js').then(m => m.personalityEngine.getResponse('blocked'));
                return await sock.sendMessage(chatId, { text: `🚫 *BLOCKED*\n${pResp}\nReason: ${dynamicCommand.blockReason || 'Unknown'}` });
            }
            if (dynamicCommand.isLocked) {
                return await sock.sendMessage(chatId, { text: `🔒 *COMMAND LOCKED*\nReason: ${dynamicCommand.lockReason || 'Admin locked this command.'}` });
            }
            // Execute the base command if it exists
            const baseCmd = commandManager.baseCommands.get(dynamicCommand.originalName);
            if (baseCmd) {
                const args = textMsg.trim().split(/\s+/).slice(1);
                return await baseCmd.execute(sock, msg, args);
            }
        }
"""

content = re.sub(r'const dynamicCommand = commandManager\.findCommand\(textMsg, senderJid\);.*?if \(dynamicCommand\.isLocked\) \{.*?\}', handler_patch, content, flags=re.DOTALL)

with open('index.js', 'w') as f:
    f.write(content)
