import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

monitor_page_new = """const MonitorPage = () => {
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
};"""

content = re.sub(r'const MonitorPage = \(\) => \((.*?)\);', monitor_page_new, content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
