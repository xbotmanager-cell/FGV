import fs from 'fs';

let content = fs.readFileSync('web-app/src/App.jsx', 'utf8');

const homePageRegex = /const HomePage = \(\) => \{[\s\S]*?\n\};/m;

const newHomePage = `const HomePage = () => {
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
        <Badge variant={stats.status === 'Online' ? 'success' : 'neutral'}><div className={\`w-2 h-2 \${stats.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full inline-block mr-2\`}/>System {stats.status || 'Checking...'}</Badge>
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
};`;

content = content.replace(homePageRegex, newHomePage);
fs.writeFileSync('web-app/src/App.jsx', content);
