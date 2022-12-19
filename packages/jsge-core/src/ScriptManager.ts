/**
 * Contains all functions required to manage scripts
 */

import { Script } from "./components";
import { GameObject } from "./GameObject";

let scriptsMap = new Map();

// window.scripts = scriptsMap;

// Calls all Script Loop Functions
export function processGameObjectScripts(gos: GameObject[]) {
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

export function initGameObjectScripts(gos: GameObject[]) {
    // gos.forEach((go) => {
    //     if (go.scripts && go.scripts.length) {
    //         go.scripts.forEach((script) => {
    //             script.init();
    //         });
    //     }
    // });
    for (const go of gos) {
        go.initialize();
    }
}

export function enrollScriptComponent(scr: Script) {
    scriptsMap.set(scr.id, scr);
}

export function removeScriptComponent(id: string) {
    scriptsMap.delete(id);
}