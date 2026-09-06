export const fetchCommands = () => fetch('/api/commands').then(res => res.json());
export const fetchProjects = () => fetch('/api/projects').then(res => res.json());
export const fetchApiKeys = () => fetch('/api/apikeys').then(res => res.json());
export const fetchStats = () => fetch('/api/stats').then(res => res.json());
export const fetchFeatures = () => fetch('/api/features').then(res => res.json());
export const fetchModes = () => fetch('/api/modes').then(res => res.json());
export const toggleFeature = (features) => fetch('/api/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features })
}).then(res => res.json());
export const login = (credentials) => fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
}).then(res => res.json());
export const fetchPersonalities = () => fetch('/api/personalities').then(res => res.json());
export const fetchBoxStyles = () => fetch('/api/box-styles').then(res => res.json());
export const fetchBotProfiles = () => fetch('/api/bot-profiles').then(res => res.json());
