/**
 * Contains all functions required to manage scripts
 */

// Calls all Script Loop Functions
export function processGameObjectScripts(gos) {
    gos.forEach((go) => {
        if (go.scripts && go.scripts.length) {
            go.scripts.forEach((script) => {
                script.loop();
            });
        }
    });
}

export function initGameObjectScripts(gos) {
    gos.forEach((go) => {
        if (go.scripts && go.scripts.length) {
            go.scripts.forEach((script) => {
                script.init();
            });
        }
    });
}