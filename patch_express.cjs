const fs = require('fs');

let code = fs.readFileSync('index.js', 'utf8');

if (!code.includes("app.get('*',")) {
    code = code.replace(
        /app\.listen\(3000,/g,
        `app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve('web-app/dist/index.html'));
        } else {
            res.status(404).json({ error: "Not Found" });
        }
    });

    app.listen(3000,`
    );
    fs.writeFileSync('index.js', code);
    console.log("Patched express wildcard routing");
}
