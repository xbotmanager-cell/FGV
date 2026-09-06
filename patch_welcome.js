const fs = require('fs');

let code = fs.readFileSync('index.js', 'utf8');

// Replace password generation and welcome message
code = code.replace(
    /const generatedPassword = Math\.random\(\)\.toString\(36\)\.slice\(-8\);[^\n]*\n/g,
    `const generateComplexPassword = () => {
                const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const numbers = '0123456789';
                let p = '';
                for(let i=0; i<4; i++) p += letters[Math.floor(Math.random()*letters.length)];
                for(let i=0; i<4; i++) p += numbers[Math.floor(Math.random()*numbers.length)];
                return p.split('').sort(() => 0.5 - Math.random()).join('');
            };
            const generatedPassword = generateComplexPassword();\n`
);

code = code.replace(
    /`🔐 \*WEB DASHBOARD ACCESS\*\\[nN]` \+\s*`URL: \(Use provided URL\)\\[nN]` \+\s*`Phone: \$\{ownerInfo\.ownerNumber\}\\[nN]` \+\s*`Password: \$\{generatedPassword\}\\[nN]\\[nN]` \+\s*`╰⊷ \*\$\{BOT_NAME\} ONLINE 🪂\*`/g,
    `\`🔐 *WEB DASHBOARD ACCESS*\\n\` +
                      \`├⊷ *URL:* \${process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || process.env.WEB_URL || process.env.HOST || "http://localhost:3000"}\\n\` +
                      \`├⊷ *Phone:* \${ownerInfo.ownerNumber}\\n\` +
                      \`└⊷ *Password:* \${generatedPassword}\\n\\n\` +
                      \`╰⊷ *\${BOT_NAME} ONLINE 🪂*\``
);

// Remove "BUNNY TECH" defaults
code = code.replace(/process\.env\.BOT_NAME \|\| 'BUNNY TECH'/g, "process.env.BOT_NAME || 'LUPIN-MD'");
code = code.replace(/'BUNNY TECH Community'/g, "BOT_NAME + ' Community'");
code = code.replace(/'BUNNY TECH'/g, "BOT_NAME");
code = code.replace(/BUNNY TECH LOG/g, "${BOT_NAME} LOG");
code = code.replace(/BUNNY TECH ONLINE/g, "${BOT_NAME} ONLINE");

fs.writeFileSync('index.js', code);
console.log("Patched index.js");
