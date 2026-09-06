import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Command, Bot, MessageSquare, Settings, Monitor, PlayCircle, LogIn, 
  Check, X, Edit, Trash, Plus, Shield, Key, FolderGit2, Users, Activity, 
  Terminal, Globe, Search, ArrowRight, Save, Copy, Eye, Zap, Database, Video
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchCommands, fetchProjects, fetchApiKeys, fetchStats, fetchFeatures, fetchModes, toggleFeature, login, fetchPersonalities, fetchBoxStyles, fetchBotProfiles } from './api';


function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// -------------------------------------------------------------
// UI COMPONENTS
// -------------------------------------------------------------
const Card = ({ className, children }) => (
  <div className={cn("bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200",
    secondary: "bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#333]",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222]"
  };
  return (
    <button {...props} className={cn("px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2", variants[variant], className)}>
      {children}
    </button>
  );
};

const Input = ({ className, value, ...props }) => {
  if (value !== undefined) {
    return <input {...props} value={value} className={cn("w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm", className)} />;
  }
  return <input {...props} className={cn("w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm", className)} />;
};

const Badge = ({ children, variant = 'success' }) => {
  const variants = {
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
    neutral: "bg-gray-100 text-gray-700 dark:bg-[#222] dark:text-gray-400 border border-gray-200 dark:border-[#333]"
  };
  return <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", variants[variant])}>{children}</span>;
};

// -------------------------------------------------------------
// NAVIGATION
// -------------------------------------------------------------
const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/commands', label: 'Cmds', icon: Command },
    { id: '/api-center', label: 'APIs', icon: Key },
    { id: '/builder', label: 'Builder', icon: Bot },
    { id: '/projects', label: 'Projects', icon: FolderGit2 },
    { id: '/chats', label: 'Chats', icon: MessageSquare },
    { id: '/monitor', label: 'Monitor', icon: Monitor },
    { id: '/tutorials', label: 'Learn', icon: PlayCircle },
    { id: '/settings', label: 'Bot', icon: Settings },
  ];

  if (location.pathname === '/login' || location.pathname === '/admin-root') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-gray-200 dark:border-[#333] pb-safe z-50">
      <div className="flex items-center overflow-x-auto px-2 py-2 gap-2 hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[64px] h-12 rounded-lg transition-colors flex-shrink-0",
                isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
              {isActive && (
                <motion.div layoutId="nav-indicator" className="absolute -top-2 w-8 h-1 bg-black dark:bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// PAGES
// -------------------------------------------------------------

const LoginPage = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('owner');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (isSuperAdmin) => {
    try {
      const res = await login({
        phone: isSuperAdmin ? undefined : phone,
        password: isSuperAdmin ? undefined : password,
        email: isSuperAdmin ? email : undefined,
        isSuperAdmin
      });
      if (res.success) {
        setAuthenticated(res.role);
        navigate(res.role === 'admin' ? '/admin-root' : '/');
      } else {
        alert(res.error || 'Authentication Failed');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0a0a0a]">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-xl mx-auto flex items-center justify-center text-white dark:text-black shadow-lg">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">System Authentication</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Secure access to the WhatsApp Control Panel</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 dark:bg-[#222] rounded-lg">
          <button onClick={() => setTab('owner')} className={cn("flex-1 py-1.5 text-sm font-medium rounded-md", tab === 'owner' ? "bg-white dark:bg-[#111] shadow-sm" : "text-gray-500")}>Bot Owner</button>
          <button onClick={() => setTab('admin')} className={cn("flex-1 py-1.5 text-sm font-medium rounded-md", tab === 'admin' ? "bg-white dark:bg-[#111] shadow-sm" : "text-gray-500")}>Super Admin</button>
        </div>

        {tab === 'owner' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp Number</label>
              <Input placeholder="255780470905" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dashboard Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" onClick={() => handleLogin(false)}>Authenticate</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input placeholder="lupinstarnley006@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button variant="secondary" className="w-full border border-gray-200 dark:border-[#333]" onClick={() => handleLogin(true)}>
              <Globe size={16} /> Continue with Google (Firebase)
            </Button>
            <p className="text-xs text-center text-gray-400">Restricted root access only.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

const HomePage = () => {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);

  const refreshData = () => {
    fetchStats().then(setStats).catch(() => {});
    fetch('/api/logs').then(res => res.json()).then(data => setLogs(data.logs || [])).catch(() => {});
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Home Dashboard</h1>
        <Badge variant={stats.status === 'Online' ? 'success' : 'neutral'}><div className={`w-2 h-2 ${stats.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full inline-block mr-2`}/>System {stats.status || 'Checking...'}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Owner & Bot Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Bot Name</span><span className="font-medium">{stats.botName || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Owner Number</span><span className="font-medium">+{stats.ownerNumber || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Active Prefix</span><span className="font-medium text-green-500 font-bold">{stats.prefix || '.'}</span></div>
          </div>
        </Card>
        
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">System Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">RAM Usage</span><span className="font-medium font-mono text-xs">{stats.ramUsage || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CPU Usage</span><span className="font-medium font-mono text-xs">{stats.cpuUsage || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Uptime</span><span className="font-medium font-mono text-xs">{stats.uptime || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Ping</span><span className="font-medium font-mono text-xs">{stats.ping || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">DB Status</span><span className="font-medium font-mono text-xs">{stats.dbStatus || '...'}</span></div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Mode</div><div className="text-xl font-bold mt-1 capitalize">{stats.prefix === 'none' ? 'Prefixless' : 'Prefixed'}</div></Card>
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Active Prefix</div><div className="text-2xl font-bold mt-1 text-green-500">{stats.prefix || '.'}</div></Card>
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Total Commands</div><div className="text-2xl font-bold mt-1">{stats.commandsCount || 0}</div></Card>
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Status</div><div className="text-2xl font-bold mt-1">{stats.status || '...'}</div></Card>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Real-Time Event History</h2>
        <Card className="divide-y divide-gray-100 dark:divide-[#333] overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">Waiting for incoming events...</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {logs.slice(0, 10).map((log, i) => (
                <div key={i} className="p-3 text-sm font-mono flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">❯</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const CommandsPage = () => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [commands, setCommands] = useState([]);
  const [search, setSearch] = useState('');
  const [editingCmd, setEditingCmd] = useState(null);

  const fetchCommandsList = () => fetch('/api/commands').then(res => res.json()).then(data => setCommands(data.commands || []));

  useEffect(() => {
    fetchCommandsList();
    const interval = setInterval(fetchCommandsList, 5000);
    return () => clearInterval(interval);
  }, []);

  const openEditor = (cmd) => {
    if (cmd) {
      setEditingCmd({ ...cmd });
    } else {
      setEditingCmd({ currentName: '', aliases: [], description: '', category: 'general', status: 'enabled', permissions: 'user', response: '' });
    }
    setEditorOpen(true);
  };

  const saveCommand = async () => {
    await fetch('/api/commands/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCmd)
    });
    setEditorOpen(false);
    fetchCommandsList();
  };

  const deleteCommand = async () => {
    if(!editingCmd.id) { setEditorOpen(false); return; }
    await fetch('/api/commands/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingCmd.id })
    });
    setEditorOpen(false);
    fetchCommandsList();
  };

  const filtered = commands.filter(c => c.currentName?.includes(search) || c.description?.includes(search) || c.aliases?.some(a => a.includes(search)));

  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Command Management</h1>
        <Button onClick={() => openEditor(null)}><Plus size={16} /> New</Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <Input className="pl-10" placeholder="Search commands, aliases, or categories..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cmd => (
          <Card key={cmd.id} className="p-4 hover:border-black dark:hover:border-white transition-colors cursor-pointer group" onClick={() => openEditor(cmd)}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold tracking-tight text-lg group-hover:text-black dark:group-hover:text-white transition-colors">.{cmd.currentName}</div>
              <Badge variant={cmd.status === 'enabled' ? 'success' : 'neutral'}>{cmd.status}</Badge>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cmd.category} category. {cmd.description}</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {cmd.aliases && cmd.aliases.map(alias => (
                 <Badge key={alias} variant="neutral">{alias}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 dark:border-[#333] pt-3">
              <Button variant="ghost" className="flex-1 p-1 h-8"><Edit size={14} /> Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-full max-w-lg">
              <Card className="flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-gray-100 dark:border-[#333] flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{editingCmd.id ? 'Edit Command' : 'New Command'}</h3>
                  <button onClick={() => setEditorOpen(false)} className="p-2 bg-gray-100 dark:bg-[#222] rounded-full"><X size={16} /></button>
                </div>
                
                <div className="p-4 space-y-4 overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Command Name</label>
                    <Input value={editingCmd.currentName} onChange={e => setEditingCmd({...editingCmd, currentName: e.target.value})} placeholder="ping" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aliases (comma separated)</label>
                    <Input value={editingCmd.aliases ? editingCmd.aliases.join(', ') : ''} onChange={e => setEditingCmd({...editingCmd, aliases: e.target.value.split(',').map(s=>s.trim()).filter(s=>s)})} placeholder="speed, latency" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input value={editingCmd.category} onChange={e => setEditingCmd({...editingCmd, category: e.target.value})} placeholder="general" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description & Help</label>
                    <Input value={editingCmd.description} onChange={e => setEditingCmd({...editingCmd, description: e.target.value})} placeholder="Checks bot response time" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Static Response (if no dynamic code)</label>
                    <Input value={editingCmd.response || ''} onChange={e => setEditingCmd({...editingCmd, response: e.target.value})} placeholder="Pong!" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Status</label>
                    <select className="p-2 rounded bg-gray-100 dark:bg-[#222] border-0" value={editingCmd.status} onChange={e => setEditingCmd({...editingCmd, status: e.target.value})}>
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Permissions</label>
                    <select className="p-2 rounded bg-gray-100 dark:bg-[#222] border-0" value={editingCmd.permissions} onChange={e => setEditingCmd({...editingCmd, permissions: e.target.value})}>
                      <option value="user">User</option>
                      <option value="owner">Owner Only</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-[#333] flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setEditorOpen(false)}>Cancel</Button>
                  {editingCmd.id && <Button variant="secondary" className="flex-1 text-red-500" onClick={deleteCommand}>Delete</Button>}
                  <Button className="flex-1" onClick={saveCommand}>Save Changes</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ApiCenterPage = () => {
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    fetchApiKeys().then(data => setKeys(data.keys || []));
  }, []);
  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">API Center</h1>
        <Button><Plus size={16} /> Generate Key</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map(key => (
          <Card key={key.id} className="p-5 hover:border-black dark:hover:border-white transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Key size={18} />
                <span className="font-semibold text-lg">{key.service || key.name} API</span>
              </div>
              <Badge variant={key.status === 'active' ? 'success' : 'neutral'}>{key.status || 'Active'}</Badge>
            </div>
            <div className="text-sm text-gray-500 mb-4">{key.description || 'API Integration Key'}</div>
            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-gray-100 dark:border-[#333] flex items-center justify-between mb-4">
              <code className="text-sm font-mono">{key.apiKey || 'sk_live_...'}</code>
              <Button variant="ghost" className="p-2 h-auto"><Copy size={14} /></Button>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Owner: {key.owner || 'System'}</span>
              <span>Priority: {key.priority || 'Normal'}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BuilderPage = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ category: '', commands: [], name: '', personality: '', prefix: '!', menuStyle: 'Boxed' });
  const [availableCommands, setAvailableCommands] = useState([]);
  const [search, setSearch] = useState('');
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetchCommands().then(data => setAvailableCommands(data.commands || []));
  }, []);

  const handleGenerate = async () => {
    setStep(5);
    try {
      const res = await fetch('/api/admin/deployments/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            botId: config.name.replace(/\s+/g, '-').toLowerCase() || 'custom-bot',
            ownerId: 'dashboard-user',
            config
         })
      });
      const data = await res.json();
      setTicket(data.id || 'GENERATED');
    } catch(e) { setTicket('ERR-DEPLOY'); }
  };

  const filteredCommands = availableCommands.filter(c => c.currentName?.includes(search));

  return (
    <div className="p-4 space-y-6 pb-24 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Custom Bot Builder</h1>
      <div className="flex items-center gap-2 mb-6 text-sm font-medium">
        {[1,2,3,4,5].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs", step >= s ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-[#333] text-gray-500")}>{s}</div>
            {s < 5 && <div className={cn("w-8 h-1 rounded-full", step > s ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-[#333]")} />}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
          <Card className="p-6 space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold">Choose Category</h2>
                <div className="grid grid-cols-2 gap-4">
                  {['AI Bot', 'Downloader', 'Business', 'Moderator'].map(c => (
                    <div key={c} onClick={() => setConfig({...config, category: c})} className={`p-4 border-2 rounded-xl cursor-pointer text-center font-medium transition-colors ${config.category === c ? 'border-black dark:border-white' : 'border-gray-200 dark:border-[#333]'}`}>{c}</div>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold">Select Commands ({availableCommands.length} available)</h2>
                <Input placeholder="Search commands to include..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-100 dark:border-[#222] rounded">
                  {filteredCommands.map(cmd => (
                    <Badge key={cmd.id} variant={config.commands.includes(cmd.currentName) ? 'success' : 'neutral'} onClick={() => {
                        const newCmds = config.commands.includes(cmd.currentName) 
                           ? config.commands.filter(c => c !== cmd.currentName) 
                           : [...config.commands, cmd.currentName];
                        setConfig({...config, commands: newCmds});
                    }} className="cursor-pointer">{cmd.currentName}</Badge>
                  ))}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-xl font-semibold">Configure Identity</h2>
                <div className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Bot Name</label><Input placeholder="My Custom Bot" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Personality</label><Input placeholder="Friendly, helpful assistant" value={config.personality} onChange={e => setConfig({...config, personality: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Prefix</label><Input placeholder="!" value={config.prefix} onChange={e => setConfig({...config, prefix: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Menu Style</label><Input placeholder="Boxed" value={config.menuStyle} onChange={e => setConfig({...config, menuStyle: e.target.value})} /></div>
                  </div>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="text-xl font-semibold">Preview Details</h2>
                <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg font-mono text-sm space-y-2">
                  <div>[NAME]: {config.name}</div>
                  <div>[PREFIX]: {config.prefix}</div>
                  <div>[COMMANDS]: {config.commands.length} selected</div>
                  <div>[PERSONALITY]: {config.personality}</div>
                </div>
              </>
            )}
            {step === 5 && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center"><Check size={32} /></div>
                <h2 className="text-2xl font-bold">Bot Generated Successfully!</h2>
                <p className="text-gray-500">Ticket: {ticket ? `#${ticket}` : 'Generating...'}</p>
                <div className="flex justify-center gap-4 pt-4">
                  <Button><FolderGit2 size={16}/> Push to GitHub</Button>
                  <Button variant="secondary">Download ZIP</Button>
                </div>
              </div>
            )}
            {step < 5 && (
              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-[#333]">
                <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</Button>
                <Button onClick={() => {
                   if (step === 4) handleGenerate();
                   else setStep(step + 1);
                }}>Continue <ArrowRight size={16}/></Button>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetchProjects().then(data => setProjects(data.projects || []));
  }, []);
  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Custom Bots & Projects</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(proj => (
          <Card key={proj.id} className="p-5 hover:border-black dark:hover:border-white transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg tracking-tight mb-1">{proj.botName || 'Project ' + proj.id}</h3>
                <span className="text-sm text-gray-500">Owner: {proj.userId || 'Unknown'}</span>
              </div>
              <Badge variant="success">Deployed</Badge>
            </div>
            <div className="flex gap-2 mb-4">
               <Badge variant="neutral">{proj.prefix || 'Prefixless'}</Badge>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-[#333]">
              <Button variant="secondary" className="flex-1"><FolderGit2 size={16} /> Source</Button>
              <Button variant="secondary" className="flex-1"><Edit size={16} /> Manage</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    fetch('/api/chats').then(res => res.json()).then(data => setChats(data.chats || [])).catch(() => {});
  }, []);

  return (
    <div className="p-4 space-y-4 pb-24 max-w-5xl mx-auto h-[90vh] flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight shrink-0">Chat Management</h1>
      <Card className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 dark:border-[#333] flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-[#333]"><Input placeholder="Search chats..." className="py-1.5 text-xs" /></div>
          <div className="overflow-y-auto flex-1">
            {chats.length === 0 ? <div className="p-4 text-sm text-gray-500">No chats synced yet.</div> : chats.map((c, i) => (
              <div key={c.id} className="p-3 border-b border-gray-100 dark:border-[#222] cursor-pointer">
                <div className="font-medium text-sm">{c.name}</div>
                <div className="text-xs text-gray-500 truncate mt-1">{c.lastMessage}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
          <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
             Select a chat to view history.
          </div>
        </div>
      </Card>
    </div>
  );
};

const MonitorPage = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch('/api/logs').then(res => res.json()).then(data => setLogs(data.logs || [])).catch(() => {});
  }, []);
  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto h-[90vh] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Incoming Monitor Feed</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Mirror</span>
          <div className="w-10 h-5 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"/></div>
        </div>
      </div>
      <Card className="flex-1 bg-black text-green-400 font-mono text-xs sm:text-sm p-4 overflow-y-auto">
        <div className="space-y-2 opacity-80">
          {logs.length === 0 ? <div>Waiting for incoming events...</div> : logs.map((log, i) => (
             <div key={i}>{log}</div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const SettingsPage = () => {
  const [features, setFeatures] = useState({});
  const [modes, setModes] = useState({});

  useEffect(() => {
    fetchFeatures().then(data => setFeatures(data.features || {}));
    fetchModes().then(data => setModes(data.modes || {}));
  }, []);

  const handleToggleFeature = (key) => {
    const updated = { ...features, [key]: !features[key] };
    setFeatures(updated);
    toggleFeature(updated);
  };

  const Toggle = ({ active, onClick }) => (
    <div onClick={onClick} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-[#333]'}`}>
      <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${active ? 'right-1 bg-white dark:bg-black' : 'left-1 bg-white dark:bg-gray-400'}`} />
    </div>
  );

  return (
    <div className="p-4 space-y-6 pb-24 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Bot Settings & Modes</h1>
        <Button><Save size={16}/> Sync Status</Button>
      </div>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Core Features</h2>
          <div className="space-y-4">
            {Object.keys(features).map(key => (
               <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-[#333] last:border-0">
                  <div>
                    <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                  <Toggle active={features[key]} onClick={() => handleToggleFeature(key)} />
               </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Modes</h2>
          <div className="space-y-4">
            {Object.keys(modes).map(key => (
               <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-[#333] last:border-0">
                  <div>
                    <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} Mode</div>
                  </div>
                  <Toggle active={modes[key]} onClick={() => {
                     const updated = { ...modes, [key]: !modes[key] };
                     setModes(updated);
                     fetch('/api/modes', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ modes: updated }) });
                  }} />
               </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const TutorialsPage = () => {
  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Learning & Tutorials</h1>
        <Badge variant="neutral">YouTube API v3</Badge>
      </div>
      <Card className="p-12 text-center text-gray-500">
        <p>No video tutorials available yet. Connect YouTube API in settings to load live video feeds.</p>
      </Card>
    </div>
  );
};

const AdminRootPage = () => {
  const [stats, setStats] = useState({});
  useEffect(() => {
    fetchProjects().then(data => setStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-4 text-red-500">
          <Shield size={24} />
          <div>
            <h2 className="font-bold">SUPER ADMIN ROOT PANEL</h2>
            <p className="text-sm opacity-80">Highly restricted access. All global configurations override individual bot settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-[#111] border-[#333] hover:border-white transition-colors cursor-pointer group">
            <Users className="mb-4 text-gray-400 group-hover:text-white" size={32} />
            <h3 className="text-lg font-bold">User Management</h3>
            <p className="text-sm text-gray-500 mt-2">Block users globally, manage Sudo access, and override permissions.</p>
          </Card>
          
          <Card className="p-6 bg-[#111] border-[#333] hover:border-white transition-colors cursor-pointer group">
            <Bot className="mb-4 text-gray-400 group-hover:text-white" size={32} />
            <h3 className="text-lg font-bold">Bot Fleet Management</h3>
            <p className="text-sm text-gray-500 mt-2">View all {stats.projects ? stats.projects.length : 0} deployed bots, push global updates instantly.</p>
          </Card>

          <Card className="p-6 bg-[#111] border-[#333] hover:border-white transition-colors cursor-pointer group">
            <Command className="mb-4 text-gray-400 group-hover:text-white" size={32} />
            <h3 className="text-lg font-bold">Global Commands</h3>
            <p className="text-sm text-gray-500 mt-2">Add, remove, or permanently lock commands across all instances.</p>
          </Card>

          <Card className="p-6 bg-[#111] border-[#333] hover:border-white transition-colors cursor-pointer group">
            <Database className="mb-4 text-gray-400 group-hover:text-white" size={32} />
            <h3 className="text-lg font-bold">API & Providers</h3>
            <p className="text-sm text-gray-500 mt-2">Manage API keys, configure fallback rules, track usage limits.</p>
          </Card>

          <Card className="p-6 bg-[#111] border-[#333] hover:border-white transition-colors cursor-pointer group">
            <Settings className="mb-4 text-gray-400 group-hover:text-white" size={32} />
            <h3 className="text-lg font-bold">System Control</h3>
            <p className="text-sm text-gray-500 mt-2">Toggle maintenance mode, manage database connections.</p>
          </Card>

          <Card className="p-6 bg-[#111] border-[#333] hover:border-white transition-colors cursor-pointer group">
            <Activity className="mb-4 text-gray-400 group-hover:text-white" size={32} />
            <h3 className="text-lg font-bold">Platform Analytics</h3>
            <p className="text-sm text-gray-500 mt-2">Total active sessions, message volume, API failures.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// MAIN APP ROUTER
// -------------------------------------------------------------
export default function App() {
  const [authenticated, setAuthenticated] = useState(null); // 'owner', 'admin', null
  const location = useLocation();

  if (!authenticated) {
    return <LoginPage setAuthenticated={setAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/commands" element={<CommandsPage />} />
            <Route path="/api-center" element={<ApiCenterPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin-root" element={authenticated === 'admin' ? <AdminRootPage /> : <HomePage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
