import { Loader } from "../Loader";
import { Asset } from "../types/Asset";

export type CSVLoaderOptions = {
    separator: string;
    lineDelimiter: string;
}

export class CSVLoader extends Loader<string[][],CSVLoaderOptions> {
    readonly name = "csv";
    protected defaultOptions: CSVLoaderOptions = {
        separator: ",",
        lineDelimiter: "\n"
    };
    public async load(asset: Asset<string[][],CSVLoaderOptions>) {
        const options = Object.assign({}, this.defaultOptions, asset.options);
        let resp = await fetch(asset.path);
        let text = await resp.text();
        let data = text.split(options.lineDelimiter).map((line) => {
            return line.split(options.separator).map((cell) => {
                return cell;
            });
        });
        asset.data = data;
        asset.loaded = true;
        return data;
    }
}