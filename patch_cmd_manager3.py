import re

with open('utils/commandManager.js', 'r') as f:
    content = f.read()

# Replace the specific check that ignores disabled commands
content = content.replace("if (foundConfig && foundConfig.status === 'enabled') {", "if (foundConfig) {")

with open('utils/commandManager.js', 'w') as f:
    f.write(content)
