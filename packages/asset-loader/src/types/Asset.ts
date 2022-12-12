export type Asset<T,Opts> = {
    name: string,
    loaded: boolean;
    data: T | null;
    path: string;
    type: string;
    options: Partial<Opts>;
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