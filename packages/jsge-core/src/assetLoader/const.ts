import { Loader } from "asset-loader";
import { PrefabAssetLoader } from "./prefab.loader";

export type AssetLoaderDictionary = {
    [index: string]: Loader<any, any>
}

export const ASSET_LOADERS: AssetLoaderDictionary = {
    prefab: new PrefabAssetLoader(),
};
