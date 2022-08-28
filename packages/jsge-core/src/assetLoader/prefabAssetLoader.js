/**
 * Contains asset Loaders for loading prefabs from JSON
 */

import { buildGameObjectFromPrefab } from "../prefab/prefabHelperFunctions";

export async function prefabAssetLoader(options) {
    let json = null;
    if (options._cachedJsonLoaded) {
        json = options._cachedJson;
    } else {
        json = await loadJson(options.path);
        options._cachedJson = json;
        options._cachedJsonLoaded = true;
    }

    return buildGameObjectFromPrefab(json, {ignoreErrors: true});
}

async function loadJson(path) {
    const resp = await fetch(path);
    return await resp.json();
}