// This is responsible for loading Content

import SpriteSheet from '../SpriteSheet.js';

let loadedContent = {};

let loadGroups = {};

const loaders = {
    "spritesheet": async (options) => {
        let s = new SpriteSheet();
        s.importFromPath(options.path, options.options.width, options.options.height);
        console.log("Spritesheet");
        await s.ready;
        options.data = s;
        options.loaded = true;
    },
    "spritesheet-options": async (options) => {
        let resp = await fetch(options.path)
        let s = new SpriteSheet();
        let json = await resp.json();
        console.log(json);
        s.importFromOptions(json);
        await s.ready;
        options.data = s;
        options.loaded = true;
    },
    "image": async (options) => {
        let p = new Promise((res, rej) => {
            let i = new Image();
            i.src = options.path;
            i.onload = () => res(i);
            i.onerror = (e) => rej(e);
        });
        options.data = await p;
        options.loaded = true;
    },
    "json": async (options) => {
        let resp = await fetch(options.path);
        options.data = resp.json();
        options.loaded = true;
    },
    "csv": async (options) => {
        let resp = await fetch(options.path);
        let text = await resp.text();
        let data = text.split('\n').map((line) => {
            return line.split(',').map((cell) => {
                return cell;
            });
        });
        options.data = data;
        options.loaded = true;
    }
}

let exampleAssetOpts = {
    name: "TEST_ASSET_1",
    path: "/asset/test.png",
    type: "spritesheet",
    options: {
        width: 16,
        height: 16
    },
    groups: [
        "level_1"
    ]
}

// Allows adding a custom loader
export function addCustomLoader(typeName, loader) {
    loaders[typeName] = loader;
}

// Defines an asset to be loaded later
export function load(assetOpts) {
    if (loadedContent[assetOpts.name]) {
        console.log("Asset already present in list");
        return;
    }
    let toSave = {
        loaded: false,
        data: null,
        path: assetOpts.path,
        type: assetOpts.type,
        options: assetOpts.options,
        groups: assetOpts.groups || []
    };
    loadedContent[assetOpts.name] = toSave;
    if (toSave.groups) {
        toSave.groups.forEach((group) => {
            if (!loadGroups[group]) {
                loadGroups[group] = [];
            }
            loadGroups[group].push(toSave);
        })
    }
}

// Access an asset (will automatically load if not already loaded)
export async function asset(assetName, forceReload=false) {
    if (!loadedContent[assetName]) {
        let err = "Asset not defined!";
        console.error(err);
        throw new Error(err);
    }
    if (!forceReload && loadedContent[assetName].loaded) {
        return loadedContent[assetName].data;
    } else {
        let type = loadedContent[assetName].type;
        if (!loaders[type]) {
            let err = "No loader defined for type " + type;
            console.error(err);
            throw new Error(err);
        }
        await loaders[type](loadedContent[assetName]);
        return loadedContent[assetName].data;
    }
}

// Force loading of all assets in a loading group
export async function loadGroup(name) {
    if (!loadGroups[name]) {
        let err = "Group not defined";
        console.error(err);
        throw new Error(err);
    }
    for (let assetOpts of loadGroups[name]) {
        if (!assetOpts.loaded) {
            await loaders[assetOpts.type](assetOpts);
        }
    }
}

export function unload(assetName) {
    if (!loadedContent[assetName]) {
        let err = "Asset not defined!";
        console.error(err);
        throw new Error(err);
    }
    if (loadedContent[assetName].loaded) {
        delete loadedContent[assetName].data;
    }
}

// Load Immediately