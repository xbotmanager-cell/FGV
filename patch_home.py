import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

home_page_new = """const HomePage = () => {
  const [stats, setStats] = useState({});
  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Home Dashboard</h1>
        <Badge variant={stats.status === 'Online' ? 'success' : 'neutral'}><div className={`w-2 h-2 ${stats.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full inline-block mr-2`}/>System {stats.status || 'Checking...'}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">System Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Bot Name</span><span className="font-medium">{stats.botName || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Owner Number</span><span className="font-medium">+{stats.ownerNumber || '...'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Version</span><span className="font-medium font-mono text-xs">{stats.version || '...'}</span></div>
          </div>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Mode</div><div className="text-xl font-bold mt-1 capitalize">{stats.prefix === 'none' ? 'Prefixless' : 'Prefixed'}</div></Card>
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Active Prefix</div><div className="text-2xl font-bold mt-1 text-green-500">{stats.prefix || '.'}</div></Card>
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Total Commands</div><div className="text-2xl font-bold mt-1">{stats.commandsCount || 0}</div></Card>
          <Card className="p-4 flex flex-col justify-center"><div className="text-gray-500 text-sm">Status</div><div className="text-2xl font-bold mt-1">{stats.status || '...'}</div></Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Real-Time Event History</h2>
        <Card className="divide-y divide-gray-100 dark:divide-[#333] p-4 text-center text-gray-500 text-sm">
          No recent events found.
        </Card>
      </div>
    </div>
  );
};"""

content = re.sub(r'const HomePage = \(\) => \((.*?)\);', home_page_new, content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
