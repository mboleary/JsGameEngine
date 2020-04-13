/**
 * A Scene contains the GameObjects for a particular part of the game.
 */

import GameObject from './GameObject.js';

export default class Scene extends GameObject {
    constructor() {
        super();
    }

    // Get all GameObjects from this scene
    get gameObjects() {
        let toRet = getGameObjectChildren(this);
        toRet.push(this);
        return toRet;
    }
}

function getGameObjectChildren(go) {
    let toRet = [];
    if (go && go.children && go.children.length) {
        go.children.forEach((child) => {
            toRet.push(child);
            let res = getGameObjectChildren(child);
            if (res && res.length) {
                res.forEach(item => toRet.push(item));
            }
        });
    }
    return toRet;
}

// Gets all GameObjects with Scripts
export function GetGameObjectsWithScripts(gos) {
    let toRet = [];
    gos.forEach((go) => {
        if (go.scripts && go.scripts.length) {
            toRet.push(go);
        }
    });
}