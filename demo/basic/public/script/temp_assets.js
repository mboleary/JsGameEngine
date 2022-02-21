/**
 * Contains definitions for all assets loaded in for the game. This is a temporary file and should be removed when AssetLoading / Prefabs are fully implemented.
 */

import { load, asset, loadGroup } from './engine/Asset/AssetLoader.js';

export function defineAssets() {
    load({
        name: "0",
        path: "/asset/fp/0.png",
        type: "image",
        groups: ["main"]
    });
    load({
        name: "1",
        path: "/asset/fp/1.png",
        type: "image",
        groups: ["main"]
    });
    load({
        name: "2",
        path: "/asset/fp/2.png",
        type: "image",
        groups: ["main"]
    });
    load({
        name: "tilesheet",
        path: "/asset/test_tilesheet.png",
        type: "spritesheet",
        options: {
            height: 16,
            width: 16
        },
        groups: ["tiledemo"]
    });
}

export function loadSpaceScene() {
    return loadGroup("main");
}

export function loadTileScene() {
    return loadGroup("tiledemo");
}