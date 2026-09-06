import fs from 'fs';

let content = fs.readFileSync('web-app/src/App.jsx', 'utf8');

const commandsPageRegex = /const CommandsPage = \(\) => \{[\s\S]*?\n\};/m;

const newCommandsPage = `const CommandsPage = () => {
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
};`;

content = content.replace(commandsPageRegex, newCommandsPage);
fs.writeFileSync('web-app/src/App.jsx', content);
