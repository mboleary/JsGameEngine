import { GameObject } from "../../GameObject"
import { ModuleBase } from "../../ModuleBase"
import { EngineTimeInterface } from "../../engine/EngineTimeInterface"
import { EngineModules } from "./EngineInternals";

export type EngineDebugInterface = {
    gameObjects: GameObject[];
    modules: ModuleBase[];
    time: EngineTimeInterface;
}

export type GlobalDebugInterface = typeof window & {
    debug: {
        engine: EngineDebugInterface;
        module: EngineModules;
        
    }
}