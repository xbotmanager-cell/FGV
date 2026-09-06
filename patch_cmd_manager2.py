import re

with open('utils/commandManager.js', 'r') as f:
    content = f.read()

content = content.replace("export export const commandManager", "export const commandManager")

with open('utils/commandManager.js', 'w') as f:
    f.write(content)
