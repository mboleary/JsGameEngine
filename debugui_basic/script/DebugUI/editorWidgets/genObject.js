// Provides an Editor Widget for Objects

import config from './config.js';

export default function genObject(obj, path, debugObj) {
    let toRet = document.createElement("div");
    let objKeys = Reflect.ownKeys(obj[path]);

    

    objKeys.forEach((key) => {
        
    });
}

function getConfigObj(obj, path) {
    let type = "";
    let instance = "";
    let name = path;
    let parentInstance = "";

    if (obj.constructor && obj.constructor.name) {
        parentInstance = obj.constructor.name;
    }

    if (obj[path] && typeof obj[path] === 'object' && Array.isArray(obj[path])) {
        type = 'array';
    } else if (obj[path] && typeof obj[path] === 'object') {
        type = 'object'
    } else if (obj[path] !== null && obj[path] !== undefined) {
        type = typeof obj[path];
    }

    if (type === 'object' && obj[path].constructor && obj[path].constructor.name) {
        instance = obj[path].constructor.name;
    }

    let mostMatch = null;
    let matchPoints = 0;

    config.forEach((config) => {
        if (config.selector.parentInstance && config.selector.parentInstance === parentInstance)
    })
}