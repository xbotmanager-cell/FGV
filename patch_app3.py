import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

# Replace SettingsPage
settings_page_new = """const SettingsPage = () => {
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
};"""
content = re.sub(r'const SettingsPage = \(\) => \((.*?)\);', settings_page_new, content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
