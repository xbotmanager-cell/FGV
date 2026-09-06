import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

admin_page_new = """const AdminRootPage = () => {
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
};"""

content = re.sub(r'const AdminRootPage = \(\) => \((.*?)\);', admin_page_new, content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
