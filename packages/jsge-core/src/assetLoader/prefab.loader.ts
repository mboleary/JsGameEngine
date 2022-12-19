/**
 * Contains asset Loader for loading prefabs from JSON
 */

import { Loader, Asset } from "asset-loader";
import { buildGameObjectFromPrefab } from "../prefab/prefabHelperFunctions";

type PrefabAsset = {
    _cachedJsonLoaded: boolean;
    _cachedJson: object;
} & Asset<object, PrefabAssetLoaderOptions>;

export type PrefabAssetLoaderOptions = {};

export class PrefabAssetLoader extends Loader<object, PrefabAssetLoaderOptions> {
    readonly name = "asset";
    protected defaultOptions: PrefabAssetLoaderOptions = {};
    public async load(asset: PrefabAsset) {
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
}

async function loadJson(path: string) {
    const resp = await fetch(path);
    return await resp.json();
}