import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

builder_page_new = """const BuilderPage = () => {
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
            botId: config.name.replace(/\\s+/g, '-').toLowerCase() || 'custom-bot',
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
};"""

match = re.search(r'const BuilderPage = \(\) => \{.*?\n\};\n', content, flags=re.DOTALL)
if match:
    content = content.replace(match.group(0), builder_page_new + '\n')
    with open('web-app/src/App.jsx', 'w') as f:
        f.write(content)
