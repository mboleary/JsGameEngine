import { PrefabComponentDefinition } from "./PrefabComponentDefinition.type";

export type PrefabGameObjectDefinition = {
    id: string;
    name: string;
    group: string;
    children?: PrefabGameObjectDefinition[];
    components?: PrefabComponentDefinition[];
    prefab?: string;
};