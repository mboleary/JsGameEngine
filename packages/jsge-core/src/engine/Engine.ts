import { ModuleBase } from "../ModuleBase";
import { Scene } from "../Scene";
import { AssetLoader } from "asset-loader";
import { ASSET_LOADERS } from "../assetLoader";
import { EngineInternalModuleManager } from "./EngineInternalModuleManager";
import { EngineGameObjectManager } from "./EngineGameObjectManager";
import { EngineHotloopManager } from "./EngineHotloopManager";

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

    /**
     * initializes the engine, locks out adding new modules
     */
    public static initialize({modules, debug = false}: EngineInitializationParams): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        
        // load modules
        for (const module of modules) {
            this.moduleManager.add(module);
        }

        this.moduleManager.lockModules();

        // @TODO set debug flags, setup debug

        // Add asset loaders
        Object.keys(ASSET_LOADERS).forEach((key:string) => this.assetLoader.addLoader(ASSET_LOADERS[key]));
    }

    public static setCurrentScene(scene: Scene): void {
        this.gameObjectManager.setCurrentScene(scene);
    }

    public static start(): void {
        // initialize modules
        for (const initFunc of this.moduleManager.initFunctions) {
            initFunc();
        }

        // start gameloop
        this.hotloopManager.startLoop();

    }
}