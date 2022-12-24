import { GameObject } from "../../GameObject"

export type ModuleDebugInterface = {
    [key: string]: object;
}

export type EngineDebugInterface = {
    gameObjects: GameObject[];
}

export type GlobalDebugInterface = typeof window & {
    debug: {
        engine: EngineDebugInterface;
        module: ModuleDebugInterface;
    }
}