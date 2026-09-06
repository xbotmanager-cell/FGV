import { updateSystem } from './updateSystem.js';
import { lockSystem } from './lockSystem.js';
import { sudoSystem } from './sudoSystem.js';
import { exportImportSystem } from './exportImportSystem.js';
import { syncSystem } from './syncSystem.js';

import { triggerSystem } from './triggerSystem.js';
import { gameSystem } from './gameSystem.js';
import { imageResponseSystem } from './imageResponseSystem.js';
import { advancedCommandSystem } from './advancedCommandSystem.js';
import { menuSystem } from './menuSystem.js';

import { deploymentSystem } from './deploymentSystem.js';
import { languageSystem } from './languageSystem.js';
import { apiManager } from './apiManager.js';

import { channelGroupSystem } from './channelGroupSystem.js';
import { antiSpamSystem } from './antiSpamSystem.js';
import { groupSecuritySystem } from './groupSecuritySystem.js';
import { customBotBuilder } from './customBotBuilder.js';
import { aiBotCreator } from './aiBotCreator.js';

export const managementLayer = {
    updateSystem,
    lockSystem,
    sudoSystem,
    exportImportSystem,
    syncSystem,
    triggerSystem,
    gameSystem,
    imageResponseSystem,
    advancedCommandSystem,
    menuSystem,
    deploymentSystem,
    languageSystem,
    apiManager,
    channelGroupSystem,
    antiSpamSystem,
    groupSecuritySystem,
    customBotBuilder,
    aiBotCreator
};

export default managementLayer;
