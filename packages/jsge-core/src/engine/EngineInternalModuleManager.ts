/**
 * Class used to manage modules
 */

import { ModuleBase } from "../ModuleBase";

export class EngineInternalModuleManager {
    public static initFunctions: Function[] = [];
    public static loopFunctions: Function[] = [];
    public static debugFunctions: Function[] = [];
    public static destroyFunctions: Function[] = [];
    private static _allowModuleLoading: boolean = true;
    private static modules: Map<string, ModuleBase> = new Map();

    public static get allowModuleLoading(): boolean {
        return this._allowModuleLoading;
    }

    public static add(module: ModuleBase): void {
        if (this._allowModuleLoading) {
            console.log(`Loading Module [${module.name}${(module.version) ? " (v:" + module.version + ")" : ""}]...`);
            if (module.hasInit) {
                this.initFunctions.push(module.init);
            }
            if (module.hasLoop) {
                this.loopFunctions.push(module.loop);
            }
        } else {
            throw new Error("A module cannot be loaded after the modules are locked");
        }
    }

    public static lockModules(): void {
        this._allowModuleLoading = false;
    }

    public static getModules(): ModuleBase[] {
        return Array.from(this.modules.values());
    }
}