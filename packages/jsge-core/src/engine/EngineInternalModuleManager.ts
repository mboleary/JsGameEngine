/**
 * Class used to manage modules
 */

import { ModuleBase } from "../ModuleBase";

export class EngineInternalModuleManager {
    public static readonly initFunctions: Function[] = [];
    public static readonly loopFunctions: Function[] = [];
    public static readonly debugFunctions: Function[] = [];
    public static readonly destroyFunctions: Function[] = [];
    private static _allowModuleLoading: boolean = true;
    private static readonly modules: Map<string, ModuleBase> = new Map();

    public static get allowModuleLoading(): boolean {
        return this._allowModuleLoading;
    }

    public static add(module: ModuleBase): void {
        if (this._allowModuleLoading) {
            if (this.modules.has(module.id)) {
                throw new Error(`A module with id ${module.id} has already been loaded`);
            }
            console.log(`Loading Module [${module.name}${(module.version) ? " (v:" + module.version + ")" : ""}]...`);
            this.modules.set(module.id, module);
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