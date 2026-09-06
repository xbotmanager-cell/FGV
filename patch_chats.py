import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

chats_page_new = """const ChatsPage = () => {
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
};"""

content = re.sub(r'const ChatsPage = \(\) => \((.*?)\);', chats_page_new, content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
