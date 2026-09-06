import re

with open('index.js', 'r') as f:
    content = f.read()

# Replace the single import with both imports
old_import = "import registerSystemCommands from './plugins/system_commands.js';"
new_imports = "import registerSettingsCommands from './plugins/settings_commands.js';\nimport registerGeneralCommands from './plugins/general_commands.js';"

if "registerSettingsCommands" not in content:
    if old_import in content:
        content = content.replace(old_import, new_imports)
    else:
        # insert at top
        content = new_imports + "\n" + content

old_call = "registerSystemCommands();"
new_calls = "registerSettingsCommands();\n        registerGeneralCommands();"

if "registerSettingsCommands();" not in content:
    if old_call in content:
        content = content.replace(old_call, new_calls)
    else:
        # insert before loginManager
        content = content.replace("const loginManager = new LoginManager();", new_calls + "\n        const loginManager = new LoginManager();")

with open('index.js', 'w') as f:
    f.write(content)
