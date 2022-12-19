import { ModuleBase } from "../ModuleBase";
import { Scene } from "../Scene";
import { AssetLoader } from "asset-loader";
import { ASSET_LOADERS } from "../assetLoader";
import { EngineInternalModuleManager } from "./EngineInternalModuleManager";
import { EngineGameObjectManager } from "./EngineGameObjectManager";

export type EngineInitializationParams = {
    modules: ModuleBase[];
    debug?: boolean;
    logMessages?: boolean;
}

export class Engine {

    private static gameLoopStarted: boolean = false;
    public static assetLoader = AssetLoader;
    private static moduleManager = EngineInternalModuleManager;
    private static gameObjectManager = EngineGameObjectManager;

    /**
     * initializes the engine, locks out adding new modules
     */
    public static initialize({modules, debug = false}: EngineInitializationParams): void {
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

    }

    public static start(): void {

    }
}