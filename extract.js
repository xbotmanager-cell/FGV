import fs from 'fs';
import path from 'path';

function extract(file, dir) {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /commandManager\.registerBaseCommand\(\{(.*?)\}\);/gs;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let block = match[1];
        let nameMatch = block.match(/name:\s*['"](.*?)['"]/);
        if (nameMatch) {
            let name = nameMatch[1];
            
            // To ensure imports are available for these execute functions,
            // we could inject common imports or just wrap the execute function differently.
            // But since this requires a lot of refactoring, maybe I can just tell the pluginLoader to skip these old files
            // and load them the old way, but ALSO load the new folder structure.
        }
    }
}
