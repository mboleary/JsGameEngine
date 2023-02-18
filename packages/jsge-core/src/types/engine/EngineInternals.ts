import { GameObject } from "../../GameObject";
import { ModuleBase } from "../../ModuleBase";

export type EngineInternals = {
    gameObjects: GameObject[]
};

export type EngineModules = {
    [key: string]: ModuleBase
};
