/**
 * Contains definitions for all assets loaded in for the game. This is a temporary file and should be removed when AssetLoading / Prefabs are fully implemented.
 */

import { load, asset, loadGroup, addCustomLoader } from '/node_modules/asset-loader/src/AssetLoader.js';
import SpriteSheet from "/node_modules/jsge-module-graphics2d/src/SpriteSheet.js";

export function defineLoadTypes() {
    addCustomLoader("spritesheet", async (options) => {
        let s = new SpriteSheet();
        s.importFromPath(options.path, options.options.width, options.options.height);
        console.log("Spritesheet");
        await s.ready;
        options.data = s;
        options.loaded = true;
    });

    addCustomLoader("spritesheet-options", async (options) => {
        let resp = await fetch(options.path)
        let s = new SpriteSheet();
        let json = await resp.json();
        console.log(json);
        s.importFromOptions(json);
        await s.ready;
        options.data = s;
        options.loaded = true;
    });
}

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