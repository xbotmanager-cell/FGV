import re

with open('web-app/src/App.jsx', 'r') as f:
    content = f.read()

login_page_new = """const LoginPage = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('owner');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (isSuperAdmin) => {
    try {
      const res = await login({
        phone: isSuperAdmin ? undefined : phone,
        password: isSuperAdmin ? undefined : password,
        email: isSuperAdmin ? email : undefined,
        isSuperAdmin
      });
      if (res.success) {
        setAuthenticated(res.role);
        navigate(res.role === 'admin' ? '/admin-root' : '/');
      } else {
        alert(res.error || 'Authentication Failed');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0a0a0a]">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-xl mx-auto flex items-center justify-center text-white dark:text-black shadow-lg">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">System Authentication</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Secure access to the WhatsApp Control Panel</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 dark:bg-[#222] rounded-lg">
          <button onClick={() => setTab('owner')} className={cn("flex-1 py-1.5 text-sm font-medium rounded-md", tab === 'owner' ? "bg-white dark:bg-[#111] shadow-sm" : "text-gray-500")}>Bot Owner</button>
          <button onClick={() => setTab('admin')} className={cn("flex-1 py-1.5 text-sm font-medium rounded-md", tab === 'admin' ? "bg-white dark:bg-[#111] shadow-sm" : "text-gray-500")}>Super Admin</button>
        </div>

        {tab === 'owner' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp Number</label>
              <Input placeholder="255780470905" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dashboard Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" onClick={() => handleLogin(false)}>Authenticate</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input placeholder="lupinstarnley006@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button variant="secondary" className="w-full border border-gray-200 dark:border-[#333]" onClick={() => handleLogin(true)}>
              <Globe size={16} /> Continue with Google (Firebase)
            </Button>
            <p className="text-xs text-center text-gray-400">Restricted root access only.</p>
          </div>
        )}
      </Card>
    </div>
  );
};"""

content = re.sub(r'const LoginPage = \(\{ setAuthenticated \}\) => \{.*?\n\};\n', login_page_new + '\n', content, flags=re.DOTALL)

with open('web-app/src/App.jsx', 'w') as f:
    f.write(content)
