import re

with open('index.js', 'r') as f:
    content = f.read()

# Add import for registerSystemCommands if missing
import_sys_cmds = "import registerSystemCommands from './plugins/system_commands.js';\n"
if "registerSystemCommands" not in content:
    content = content.replace("import { jidManager } from './utils/jidManager.js';", "import { jidManager } from './utils/jidManager.js';\n" + import_sys_cmds)

# Call registerSystemCommands inside main() before startBot
if "registerSystemCommands();" not in content:
    content = content.replace("const loginManager = new LoginManager();", "registerSystemCommands();\n        const loginManager = new LoginManager();")

handler_patch = """
        const dynamicCommand = commandManager.findCommand(textMsg, senderJid);
        
        if (!dynamicCommand) return;
        
        if (dynamicCommand.status === 'blocked') {
            const { personalityEngine } = await import('./utils/engines/personalityEngine.js');
            const pResp = personalityEngine.getResponse('blocked');
            await sock.sendMessage(chatId, { text: `🚫 *BLOCKED*\\n${pResp}\\nReason: ${dynamicCommand.blockReason || 'Admin decision'}` });
            return;
        }

        if (dynamicCommand.isLocked) {
"""

content = re.sub(r'const dynamicCommand = commandManager\.findCommand\(textMsg, senderJid\);\s*if \(\!dynamicCommand\) return;\s*if \(dynamicCommand\.isLocked\) \{', handler_patch, content, flags=re.DOTALL)

with open('index.js', 'w') as f:
    f.write(content)
