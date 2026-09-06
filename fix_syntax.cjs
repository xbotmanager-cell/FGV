const fs = require('fs');

let code = fs.readFileSync('index.js', 'utf8');

const lastPart = `    app.use((req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve('web-app/dist/index.html'));
        } else {
            res.status(404).json({ error: "Not Found" });
        }
    });

    app.listen(3000, "0.0.0.0", () => {
        console.log(\`[INFO] 🌐 Web dashboard listening on port \${port}\`);
        if (typeof UltraCleanLogger !== 'undefined') UltraCleanLogger.info(\`🌐 Web dashboard running on port \${port}\`);
    });
} catch(e) {
    fs.writeFileSync("express_error.txt", String(e));
}`;

code = code.replace(/app\.get\(\/\.\*\/,[\s\S]*?\} catch\(e\) \{[\s\S]*?\}/, lastPart);

fs.writeFileSync('index.js', code);
console.log("Fixed syntax");
