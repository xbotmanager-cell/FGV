import re

for file in ['utils/engines/personalityEngine.js', 'utils/engines/boxStyleEngine.js']:
    with open(file, 'r') as f:
        content = f.read()
    
    content = content.replace("snapshot.forEach(doc =>", "snapshot.docs.forEach(doc =>")
    
    with open(file, 'w') as f:
        f.write(content)
