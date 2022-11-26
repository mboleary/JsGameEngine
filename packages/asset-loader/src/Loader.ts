import { Asset } from "./types/Asset";

export abstract class Loader<T, Opts> {
    readonly abstract name: string;
    protected abstract defaultOptions: Opts;
    abstract load(asset: Asset<T,Opts>): Promise<T> | T;
}