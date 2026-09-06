import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

# Replace ApiCenterPage
apicenter_page_new = """const ApiCenterPage = () => {
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
};"""
content = re.sub(r'const ApiCenterPage = \(\) => \((.*?)\);', apicenter_page_new, content, flags=re.DOTALL)

# Replace ProjectsPage
projects_page_new = """const ProjectsPage = () => {
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
};"""
content = re.sub(r'const ProjectsPage = \(\) => \((.*?)\);', projects_page_new, content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
