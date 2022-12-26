import { ModuleBase } from "../ModuleBase";
import { Scene } from "../Scene";
import { AssetLoader } from "asset-loader";
import { ASSET_LOADERS } from "../assetLoader";
import { EngineInternalModuleManager } from "./EngineInternalModuleManager";
import { EngineGameObjectManager } from "./EngineGameObjectManager";
import { EngineHotloopManager } from "./EngineHotloopManager";
import { GameObject } from "../GameObject";
import { EngineDebugManager } from "./EngineDebugManager";
import { ScriptManagerModule } from "../modules/ScriptManager.module";

export type EngineInitializationParams = {
    modules: ModuleBase[];
    debug?: boolean;
    logMessages?: boolean;
}

export class Engine {
    public static assetLoader = AssetLoader;
    private static initialized = false;
    private static moduleManager = EngineInternalModuleManager;
    private static gameObjectManager = EngineGameObjectManager;
    private static hotloopManager = EngineHotloopManager;
    private static debugManager = EngineDebugManager;

    /**
     * Returns all modules
     */
    public static get modules(): ModuleBase[] {
        return this.moduleManager.getModules();
    }

    /**
     * initializes the engine, locks out adding new modules
     */
    public static initialize({modules, debug = true}: EngineInitializationParams): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.moduleManager.add(new ScriptManagerModule());
        
        // load modules
        for (const module of modules) {
            this.moduleManager.add(module);
        }

        // @TODO set debug flags, setup debug
        if (debug) {
            this.debugManager.buildDebug();
        }

        this.moduleManager.lockModules();

        

        // Add asset loaders
        Object.keys(ASSET_LOADERS).forEach((key:string) => this.assetLoader.addLoader(ASSET_LOADERS[key]));
    }

    public static start(): void {
        // initialize modules
        for (const initFunc of this.moduleManager.initFunctions) {
            initFunc();
        }

        // start gameloop
        this.hotloopManager.startLoop();
    }

    // GameObject-related functions
    public static setCurrentScene(scene: Scene): void {
        this.gameObjectManager.setCurrentScene(scene);
    }

    public static getCurrentScene() {
        return this.gameObjectManager.getCurrentScene();
    }

    public static enrollGameObject(go: GameObject) {
        return this.gameObjectManager.enrollGameObject(go);
    }

    public static deleteGameObject(go: GameObject) {
        return this.gameObjectManager.deleteGameObject(go);
    }

    public static getGameObjectByID(id: string) {
        return this.gameObjectManager.getGameObjectByID(id);
    }

    public static getGameObjectByName(name: string) {
        return this.gameObjectManager.getGameObjectByName(name);
    }

    public static getGameObjectByGroup(group: string) {
        return this.gameObjectManager.getGameObjectByGroup(group);
    }

}