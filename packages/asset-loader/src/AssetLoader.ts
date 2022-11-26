// This is responsible for loading Content

import { Loader } from "./Loader";
import { Asset, AssetConfig, AssetLoadOptions } from "./types";

// import SpriteSheet from '../SpriteSheet.js';

// let loadedContent = {};

// let loadGroups = {};

// These are used to load an asset into a usable format
// const loaders = {
//     "spritesheet": async (options) => {
//         let s = new SpriteSheet();
//         s.importFromPath(options.path, options.options.width, options.options.height);
//         console.log("Spritesheet");
//         await s.ready;
//         options.data = s;
//         options.loaded = true;
//     },
//     "spritesheet-options": async (options) => {
//         let resp = await fetch(options.path)
//         let s = new SpriteSheet();
//         let json = await resp.json();
//         console.log(json);
//         s.importFromOptions(json);
//         await s.ready;
//         options.data = s;
//         options.loaded = true;
//     },
//     "image": async (options) => {
//         let p = new Promise((res, rej) => {
//             let i = new Image();
//             i.src = options.path;
//             i.onload = () => res(i);
//             i.onerror = (e) => rej(e);
//         });
//         options.data = await p;
//         options.loaded = true;
//     },
//     "json": async (options) => {
//         let resp = await fetch(options.path);
//         options.data = resp.json();
//         options.loaded = true;
//     },
//     "csv": async (options) => {
//         let resp = await fetch(options.path);
//         let text = await resp.text();
//         let data = text.split('\n').map((line) => {
//             return line.split(',').map((cell) => {
//                 return cell;
//             });
//         });
//         options.data = data;
//         options.loaded = true;
//     }
// }

// let exampleAssetOpts = {
//     name: "TEST_ASSET_1",
//     path: "/asset/test.png",
//     type: "spritesheet",
//     options: {
//         width: 16,
//         height: 16
//     },
//     groups: [
//         "level_1"
//     ]
// }

export class AssetLoader {
    private static loaders: Map<string, Loader<any, any>> = new Map();
    private static loadedContent: Map<string, Asset<any, any>> = new Map();
    private static loadGroups: Map<string, Asset<any, any>[]> = new Map();

    /**
     * Adds a loader for new asset types
     * @param loader new loader instance
     */
    public static addLoader(loader: Loader<any, any>) {
        this.loaders.set(loader.name, loader);
    }

    /**
     * Defines an asset to be loaded later
     * @param assetConfig Asset Configuration to define an asset from 
     */
    public static async load(assetConfig: AssetConfig) {
        if (this.loadedContent.has(assetConfig.name)) {
            return;
        }
        const toSave: Asset<any, any> = {
            name: assetConfig.name,
            loaded: false,
            data: null,
            path: assetConfig.path,
            type: assetConfig.type,
            options: assetConfig.options || {},
            groups: assetConfig.groups || []
        };
        this.loadedContent.set(assetConfig.name, toSave);
        if (toSave.groups) {
            toSave.groups.forEach((group) => {
                let arr: Asset<any, any>[] = [];
                if (this.loadGroups.has(group)) {
                    this.loadGroups.get(group);
                } else {
                    this.loadGroups.set(group, arr);
                }
                arr.push(toSave);
            });
        }
        if (assetConfig.loadImmediate) {
            this.asset(assetConfig.name, {});
        }
    }

    /**
     * 
     * @param assetName 
     * @param options 
     * @returns 
     */
    public static async asset<T>(assetName: string, options: AssetLoadOptions = {}): Promise<T> {
        const asset = this.loadedContent.get(assetName);
        if (!asset) {
            const err = `Asset '${assetName}' not defined!`;
            console.error(err);
            throw new Error(err);
        }
        if (!options.forceReload && asset.loaded) {
            return asset.data;
        } else {
            const type = asset.type;
            const loader = this.loaders.get(type);
            if (!loader) {
                const err = "No loader defined for type " + type;
                console.error(err);
                throw new Error(err);
            }
            const returnedVal = await loader.load(asset);
            return returnedVal || asset.data;
        }
    }

    public static groups(): IterableIterator<string> {
        return this.loadGroups.keys();
    }

    public static getAssetsInGroup(groupName: string): Asset<any,any>[] {
        return this.loadGroups.get(groupName) || [];
    }

    public static async loadGroup(groupName: string): Promise<Asset<any, any>[]> {
        const loadGroup = this.loadGroups.get(groupName);
        if (loadGroup) {
            return Promise.all(loadGroup.map((a: Asset<any,any>) => this.asset<any>(a.name)));
        } else {
            let err = "Group not defined";
            console.error(err);
            throw new Error(err);
        }
    }

    public static async unload(assetName: string): Promise<void> {
        const asset = this.loadedContent.get(assetName);
        if (asset) {
            if (asset.loaded) {
                delete asset.data;
            }
        } else {
            let err = "Asset not defined!";
            console.error(err);
            throw new Error(err);
        }
        
    }
}

// Allows adding a custom loader
// export function addCustomLoader(typeName, loader) {
//     loaders[typeName] = loader;
// }

// Defines an asset to be loaded later
// export function define(assetOpts) {
//     if (loadedContent[assetOpts.name]) {
//         // console.log("Asset already present in list");
//         return;
//     }
//     let toSave = {
//         loaded: false,
//         data: null,
//         path: assetOpts.path,
//         type: assetOpts.type,
//         options: assetOpts.options,
//         groups: assetOpts.groups || []
//     };
//     loadedContent[assetOpts.name] = toSave;
//     if (toSave.groups) {
//         toSave.groups.forEach((group) => {
//             if (!loadGroups[group]) {
//                 loadGroups[group] = [];
//             }
//             loadGroups[group].push(toSave);
//         })
//     }
// }

// Access an asset (will automatically load if not already loaded)
// export async function load(assetName, forceReload=false) {
//     if (!loadedContent[assetName]) {
//         console.log(assetName, JSON.parse(JSON.stringify(loadedContent)));
//         let err = "Asset not defined!";
//         console.error(err);
//         throw new Error(err);
//     }
//     if (!forceReload && loadedContent[assetName].loaded) {
//         return loadedContent[assetName].data;
//     } else {
//         let type = loadedContent[assetName].type;
//         if (!loaders[type]) {
//             let err = "No loader defined for type " + type;
//             console.error(err);
//             throw new Error(err);
//         }
//         const returnedVal = await loaders[type](loadedContent[assetName]);
//         return returnedVal || loadedContent[assetName].data;
//     }
// }

// Force loading of all assets in a loading group
// export async function loadGroup(name) {
//     if (!loadGroups[name]) {
//         let err = "Group not defined";
//         console.error(err);
//         throw new Error(err);
//     }
//     for (let assetOpts of loadGroups[name]) {
//         if (!assetOpts.loaded) {
//             await loaders[assetOpts.type](assetOpts);
//         }
//     }
// }

// export function unload(assetName) {
//     if (!loadedContent[assetName]) {
//         let err = "Asset not defined!";
//         console.error(err);
//         throw new Error(err);
//     }
//     if (loadedContent[assetName].loaded) {
//         delete loadedContent[assetName].data;
//     }
// }

// Load Immediately