import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

# Add API imports
import_statement = "import { fetchCommands, fetchProjects, fetchApiKeys, fetchStats, fetchFeatures, fetchModes, toggleFeature, login } from './api';\n"
if "fetchCommands" not in content:
    content = content.replace("import { twMerge } from 'tailwind-merge';", "import { twMerge } from 'tailwind-merge';\n" + import_statement)

# Replace CommandsPage
commands_page_new = """const CommandsPage = () => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [commands, setCommands] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchCommands().then(data => setCommands(data.commands || []));
  }, []);

  const filtered = commands.filter(c => c.currentName?.includes(search) || c.description?.includes(search) || c.aliases?.some(a => a.includes(search)));

  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Command Management</h1>
        <Button onClick={() => setEditorOpen(true)}><Plus size={16} /> New</Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <Input className="pl-10" placeholder="Search commands, aliases, or categories..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cmd => (
          <Card key={cmd.id} className="p-4 hover:border-black dark:hover:border-white transition-colors cursor-pointer group" onClick={() => setEditorOpen(true)}>
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
                  <h3 className="font-semibold text-lg">Command Editor</h3>
                  <button onClick={() => setEditorOpen(false)} className="p-2 bg-gray-100 dark:bg-[#222] rounded-full"><X size={16} /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto">
                  <p className="text-sm text-gray-500">Note: Actual updates go through WhatsApp Bot core.</p>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-[#333] flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setEditorOpen(false)}>Close</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};"""

content = re.sub(r'const CommandsPage = \(\) => \{.*?\n\};\n', commands_page_new + '\n', content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
