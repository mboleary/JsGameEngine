import { Loader } from "../Loader";
import { Asset } from "../types/Asset";

export type JSONLoaderOptions = {};

export class JSONLoader extends Loader<object, JSONLoaderOptions> {
    readonly name = "json";
    protected defaultOptions: JSONLoaderOptions = {};
    public async load(asset: Asset<object, JSONLoaderOptions>) {
        let resp = await fetch(asset.path);
        const data = resp.json();
        asset.data = data;
        asset.loaded = true;
        return data;
    }
}