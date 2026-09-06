import re

with open('utils/commandManager.js', 'r') as f:
    content = f.read()

# Fix the sed injection mistake from earlier
content = content.replace("""const commandManager = new CommandManager();\\nimport registerSystemCommands from \\"./plugins/system_commands.js\\";\\nregisterSystemCommands();""", "")
content = content.replace('const commandManager = new CommandManager();\nimport registerSystemCommands from "./plugins/system_commands.js";\nregisterSystemCommands();', 'export const commandManager = new CommandManager();')

with open('utils/commandManager.js', 'w') as f:
    f.write(content)
