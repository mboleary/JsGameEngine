/**
 * Contains debug helper functions
 */
import { EngineInternalModuleManager } from "./EngineInternalModuleManager";
import { EngineModules, EngineDebugInterface, GlobalDebugInterface } from "../types";
import { EngineGameObjectManager } from "./EngineGameObjectManager";
import { EngineTimeInterface } from "./EngineTimeInterface";


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
            },
            get modules() {
                return EngineInternalModuleManager.getModuleArray();
            },
            time: EngineTimeInterface,
        };

        

        return engineObject;
    }

    private static buildModuleDebug(): EngineModules {
        return EngineInternalModuleManager.getModules();
    }
}