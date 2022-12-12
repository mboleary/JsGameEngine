// temporary type def for ModuleBase class

declare module "jsge-core/src/ModuleBase" {
    export class ModuleBase {
        readonly name: string;
        readonly debugName: string | null;
        readonly version: string;
        readonly meta: object;
        init(): void;
        debug(): object;
        loop(internals: EngineInternals): void;
        onClose(): void;
        onDebugEvent(): void;
    }

    // export type ModuleBase = typeof ModuleBaseClass;
    
    export type EngineInternals = {
        gameObjects: any[],
        currTime: number,
        TARGET_MILLIS_PER_FRAME: number
    }
}