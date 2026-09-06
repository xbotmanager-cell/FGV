import fs from 'fs';

let content = fs.readFileSync('index.js', 'utf8');

const loggerClassRegex = /class UltraCleanLogger \{[\s\S]*?\}\n/m;

const newLoggerClass = `global.systemLogs = [];
function pushSysLog(msg) {
    const timestamp = new Date().toLocaleTimeString();
    global.systemLogs.unshift(\`[\${timestamp}] \${msg}\`);
    if (global.systemLogs.length > 50) global.systemLogs.pop();
}

class UltraCleanLogger {
    static log(...args) {
        const message = args.join(' ').toLowerCase();
        const suppressPatterns = ['buffer','timeout','transaction','failed to decrypt','received error','sessionerror','bad mac','stream errored','baileys','whatsapp','ws','closing session','sessionentry','_chains','registrationid','currentratchet','indexinfo','pendingprekey','ephemeralkeypair','lastremoteephemeralkey','rootkey','basekey','signal','key','ratchet','encryption','decryption','qr','scan','pairing','connection.update','creds.update','messages.upsert','group','participant','metadata','presence.update','chat.update','message.receipt.update','message.update','keystore','keypair','pubkey','privkey','<buffer','05 ','0x','signalkey','signalprotocol','sessionstate','senderkey','groupcipher','signalgroup'];
        for (const pattern of suppressPatterns) { if (message.includes(pattern)) return; }
        const timestamp = chalk.gray(\`[\${new Date().toLocaleTimeString()}]\`);
        const cleanArgs = args.map(arg => typeof arg === 'string' ? arg.replace(/\\n\\s+/g, ' ') : arg);
        originalConsoleMethods.log(timestamp, ...cleanArgs);
        pushSysLog(cleanArgs.join(' '));
    }
    static error(...args) {
        const message = args.join(' ');
        if (message.toLowerCase().includes('fatal') || message.toLowerCase().includes('critical') || message.includes('❌')) {
            const timestamp = chalk.red(\`[\${new Date().toLocaleTimeString()}]\`);
            originalConsoleMethods.error(timestamp, ...args);
            pushSysLog(\`ERROR: \${message}\`);
        }
    }
    static success(...args) { originalConsoleMethods.log(chalk.green(\`[\${new Date().toLocaleTimeString()}]\`), chalk.green('✅'), ...args); pushSysLog(\`SUCCESS: \${args.join(' ')}\`); }
    static info(...args) { originalConsoleMethods.log(chalk.blue(\`[\${new Date().toLocaleTimeString()}]\`), chalk.blue('ℹ️'), ...args); pushSysLog(\`INFO: \${args.join(' ')}\`); }
    static warning(...args) { originalConsoleMethods.log(chalk.yellow(\`[\${new Date().toLocaleTimeString()}]\`), chalk.yellow('⚠️'), ...args); pushSysLog(\`WARN: \${args.join(' ')}\`); }
    static event(...args) { originalConsoleMethods.log(chalk.magenta(\`[\${new Date().toLocaleTimeString()}]\`), chalk.magenta('🎭'), ...args); pushSysLog(\`EVENT: \${args.join(' ')}\`); }
    static command(...args) { originalConsoleMethods.log(chalk.cyan(\`[\${new Date().toLocaleTimeString()}]\`), chalk.cyan('💬'), ...args); pushSysLog(\`CMD: \${args.join(' ')}\`); }
    static critical(...args) { originalConsoleMethods.error(chalk.red(\`[\${new Date().toLocaleTimeString()}]\`), chalk.red('🚨'), ...args); pushSysLog(\`CRITICAL: \${args.join(' ')}\`); }
    static group(...args) { originalConsoleMethods.log(chalk.magenta(\`[\${new Date().toLocaleTimeString()}]\`), chalk.magenta('👥'), ...args); pushSysLog(\`GROUP: \${args.join(' ')}\`); }
    static member(...args) { originalConsoleMethods.log(chalk.cyan(\`[\${new Date().toLocaleTimeString()}]\`), chalk.cyan('👤'), ...args); pushSysLog(\`MEMBER: \${args.join(' ')}\`); }
}
`;

content = content.replace(loggerClassRegex, newLoggerClass);
fs.writeFileSync('index.js', content);
