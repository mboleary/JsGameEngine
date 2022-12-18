import { PrefabAssetDefinition } from "./PrefabAssetDefinition.type";
import { PrefabGameObjectDefinition } from "./PrefabGameObjectDefinition.type";
import { PrefabModuleDefinition } from "./PrefabModuleDefinition.type";

export type Prefab = {
    version: string,
    scene: boolean,
    root: PrefabGameObjectDefinition;
    modules: PrefabModuleDefinition[];
    name: string;
    assets?: PrefabAssetDefinition[];
    meta: object;
};

export type PrefabOptions = {
    ignoreErrors?: boolean
};