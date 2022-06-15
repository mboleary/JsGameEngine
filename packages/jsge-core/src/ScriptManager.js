/**
 * Contains all functions required to manage scripts
 */

let scripts = [];
let scriptsMap = new Map();

window.scripts = scriptsMap;

// Calls all Script Loop Functions
export function processGameObjectScripts(gos) {
    // @TODO fix this for components
    // gos.forEach((go) => {
    //     if (go.scripts && go.scripts.length) {
    //         go.scripts.forEach((script) => {
    //             script.loop();
    //         });
    //     }
    // });
    for (const script of scriptsMap.values()) {
        script.loop();
    }
}

export function initGameObjectScripts(gos) {
    // gos.forEach((go) => {
    //     if (go.scripts && go.scripts.length) {
    //         go.scripts.forEach((script) => {
    //             script.init();
    //         });
    //     }
    // });
    for (const script of scriptsMap.values()) {
        script.init();
    }
}

export function enrollScriptComponent(scr) {
    scriptsMap.set(scr.id, scr);
}

export function removeScriptComponent(id) {
    scriptsMap.delete(id);
}