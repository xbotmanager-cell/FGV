const fs = require('fs');

let code = fs.readFileSync('index.js', 'utf8');

code = code.replace(
    /app\.get\('\*', \(req, res\) => \{[\s\S]*?\}\);/g,
    `app.use((req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve('web-app/dist/index.html'));
        } else {
            res.status(404).json({ error: "Not Found" });
        }
    });`
);

fs.writeFileSync('index.js', code);
console.log("Patched express v5 wildcard routing");
