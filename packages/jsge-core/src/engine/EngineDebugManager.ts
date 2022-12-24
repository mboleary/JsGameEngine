/**
 * Contains debug helper functions
 */
import { EngineInternalModuleManager } from "./EngineInternalModuleManager";
import { ModuleDebugInterface, EngineDebugInterface, GlobalDebugInterface } from "../types";
import { EngineGameObjectManager } from "./EngineGameObjectManager";


export class EngineDebugManager {

    public static buildDebug() {
        (window as GlobalDebugInterface).debug = {
            engine: this.buildEngineDebug(),
            module: this.buildModuleDebug(),
        };

        console.log("debug:", (window as GlobalDebugInterface).debug);
    }

    private static buildEngineDebug(): EngineDebugInterface {
        const engineObject: EngineDebugInterface = {
            get gameObjects() {
                return EngineGameObjectManager.getGameObjects();
            }
        };

        

        return engineObject;
    }

    private static buildModuleDebug(): ModuleDebugInterface {
        const debugObject: ModuleDebugInterface = {};

        for (const module of EngineInternalModuleManager.getModules()) {
            if (module.debugName) {
                debugObject[module.debugName] = module.debug();
            }
        }

        console.log("module dbg obj", debugObject);

        return debugObject;
    }
}