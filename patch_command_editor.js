import fs from 'fs';

let content = fs.readFileSync('web-app/src/App.jsx', 'utf8');

const regex = /<div className="p-4 space-y-4 overflow-y-auto">([\s\S]*?)<\/div>\s*<div className="p-4 border-t border-gray-100 dark:border-\[#333\] flex gap-2">/m;

const editorContent = `<div className="p-4 space-y-6 overflow-y-auto">
                  <div className="space-y-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Basic Information</h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Command Name</label>
                        <Input value={editingCmd.name || editingCmd.currentName} onChange={e => setEditingCmd({...editingCmd, name: e.target.value, currentName: e.target.value})} placeholder="ping" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Aliases (comma separated)</label>
                        <Input value={editingCmd.aliases ? editingCmd.aliases.join(', ') : ''} onChange={e => setEditingCmd({...editingCmd, aliases: e.target.value.split(',').map(s=>s.trim()).filter(s=>s)})} placeholder="speed, latency" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input value={editingCmd.category} onChange={e => setEditingCmd({...editingCmd, category: e.target.value})} placeholder="general" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input value={editingCmd.description} onChange={e => setEditingCmd({...editingCmd, description: e.target.value})} placeholder="Checks bot response time" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Usage Pattern</label>
                        <Input value={editingCmd.usage || ''} onChange={e => setEditingCmd({...editingCmd, usage: e.target.value})} placeholder=".ping" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Reaction Emoji</label>
                        <Input className="w-24 text-center text-lg" value={editingCmd.reaction || ''} onChange={e => setEditingCmd({...editingCmd, reaction: e.target.value})} placeholder="⚡" />
                      </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#333]">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Personality Responses</h4>
                      {['LUPIN_MD', 'SWIFTBOT', 'BULL_MD', 'JOKER', 'DODGE_MD', 'KOE', 'BUNNY_MD', 'LUCIFER', 'ANGELS', 'ASTRA_X'].map(pers => (
                          <div key={pers} className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">{pers.replace('_', ' ')}</label>
                              <Input 
                                  value={editingCmd.responses?.[pers] || ''} 
                                  onChange={e => setEditingCmd({...editingCmd, responses: {...(editingCmd.responses || {}), [pers]: e.target.value}})} 
                                  placeholder={\`\${pers} style response...\`} 
                              />
                          </div>
                      ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#333]">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Help Menu Text</h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Help Overview</label>
                        <Input value={editingCmd.help?.overview || ''} onChange={e => setEditingCmd({...editingCmd, help: {...(editingCmd.help || {}), overview: e.target.value}})} placeholder="Checks bot response speed" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Features (comma separated)</label>
                        <Input value={editingCmd.help?.features ? editingCmd.help.features.join(', ') : ''} onChange={e => setEditingCmd({...editingCmd, help: {...(editingCmd.help || {}), features: e.target.value.split(',').map(s=>s.trim()).filter(s=>s)}})} placeholder="Shows connection status, System info" />
                      </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#333]">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Media Attachment (Optional)</h4>
                      <div className="flex gap-2">
                        <select className="p-2 rounded bg-gray-100 dark:bg-[#222] border-0 text-sm" value={editingCmd.media?.type || 'text'} onChange={e => setEditingCmd({...editingCmd, media: {...(editingCmd.media || {}), type: e.target.value}})}>
                            <option value="text">None (Text Only)</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="document">Document</option>
                        </select>
                        <Input className="flex-1" value={editingCmd.media?.url || ''} onChange={e => setEditingCmd({...editingCmd, media: {...(editingCmd.media || {}), url: e.target.value}})} placeholder="https://... (URL)" />
                      </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#333]">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Access Control</h4>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Status</label>
                        <select className="p-2 rounded bg-gray-100 dark:bg-[#222] border-0" value={editingCmd.enabled !== false ? 'enabled' : 'disabled'} onChange={e => setEditingCmd({...editingCmd, enabled: e.target.value === 'enabled'})}>
                          <option value="enabled">Active</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Permission Level</label>
                        <select className="p-2 rounded bg-gray-100 dark:bg-[#222] border-0" value={editingCmd.permission || editingCmd.permissions || 'Public'} onChange={e => setEditingCmd({...editingCmd, permission: e.target.value})}>
                          <option value="Public">Public</option>
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                          <option value="Sudo">Sudo</option>
                        </select>
                      </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-[#333] flex gap-2">`;

content = content.replace(regex, editorContent);
fs.writeFileSync('web-app/src/App.jsx', content);
