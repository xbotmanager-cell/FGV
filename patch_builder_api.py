import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

import_line = "import { fetchCommands, fetchProjects, fetchApiKeys, fetchStats, fetchFeatures, fetchModes, toggleFeature, login } from './api';"
new_import_line = "import { fetchCommands, fetchProjects, fetchApiKeys, fetchStats, fetchFeatures, fetchModes, toggleFeature, login, fetchPersonalities, fetchBoxStyles, fetchBotProfiles } from './api';"

content = content.replace(import_line, new_import_line)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
