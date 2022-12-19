/**
 * Contains asset Loaders for loading prefabs from JSON
 */

import { buildGameObjectFromPrefab } from "../prefab/prefabHelperFunctions";
import type { Asset } from "asset-loader";

type PrefabAsset = {
    _cachedJsonLoaded: boolean;
    _cachedJson: object;
} & Asset<object, object>;

export async function prefabAssetLoader(asset: PrefabAsset) {
    let json = null;
    if (asset._cachedJsonLoaded) {
        json = asset._cachedJson;
    } else {
        json = await loadJson(asset.path);
        asset._cachedJson = json;
        asset._cachedJsonLoaded = true;
    }

    // Note: we don't set the data value in this one as we don't want to return stale references

    return buildGameObjectFromPrefab(json, {ignoreErrors: true});
}

async function loadJson(path: string) {
    const resp = await fetch(path);
    return await resp.json();
}