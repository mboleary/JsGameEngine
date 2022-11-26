export type Asset<T,Opts> = {
    name: string,
    loaded: boolean;
    data: T;
    path: string;
    type: string;
    options: Opts;
    groups: string[]
};

export type AssetConfig = {
    name: string,
    path: string,
    type: string,
    options?: object,
    groups?: string[],
    loadImmediate?: boolean
}

export type AssetLoadOptions = {
    forceReload?: boolean,
}