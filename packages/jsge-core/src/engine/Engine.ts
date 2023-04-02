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
import { EngineModules } from "../types";
import { EngineEventManager } from "./EventEventManager";

export type EngineInitializationParams = {
    modules: ModuleBase[];
    debug?: boolean;
    logMessages?: boolean;
}

export class Engine {
    public static assetLoader = AssetLoader;
    private static initialized = false;

    /**
     * Returns all modules
     */
    public static get modules(): EngineModules {
        return EngineInternalModuleManager.getModules();
    }

    public static getModuleByID<T extends ModuleBase>(id: string): T | null {
        return EngineInternalModuleManager.getModuleByID(id) as T;
    }

    /**
     * initializes the engine, locks out adding new modules
     */
    public static initialize({modules, debug = true}: EngineInitializationParams): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        EngineInternalModuleManager.add(new ScriptManagerModule());
        
        // load modules
        for (const module of modules) {
            EngineInternalModuleManager.add(module);
        }

        // @TODO set debug flags, setup debug
        if (debug) {
            EngineDebugManager.buildDebug();
        }

        EngineInternalModuleManager.lockModules();

        // Add asset loaders
        Object.keys(ASSET_LOADERS).forEach((key:string) => AssetLoader.addLoader(ASSET_LOADERS[key]));

        EngineEventManager.callInitFunctions();
    }

    public static start(): void {
        // initialize modules
        for (const initFunc of EngineInternalModuleManager.initFunctions) {
            initFunc();
        }

        // start gameloop
        EngineHotloopManager.startLoop();
    }

    // GameObject-related functions
    public static setCurrentScene(scene: Scene): void {
        EngineGameObjectManager.setCurrentScene(scene);
    }

    public static getCurrentScene() {
        return EngineGameObjectManager.getCurrentScene();
    }

    public static enrollGameObject(go: GameObject) {
        return EngineGameObjectManager.enrollGameObject(go);
    }

    public static deleteGameObject(go: GameObject) {
        return EngineGameObjectManager.deleteGameObject(go);
    }

    public static getGameObjectByID(id: string) {
        return EngineGameObjectManager.getGameObjectByID(id);
    }

    public static getGameObjectByName(name: string) {
        return EngineGameObjectManager.getGameObjectByName(name);
    }

    public static getGameObjectByGroup(group: string) {
        return EngineGameObjectManager.getGameObjectByGroup(group);
    }

    // Engine-based event handling
    public static onInit(func: Function) {
        return EngineEventManager.onInit(func);
    }

}