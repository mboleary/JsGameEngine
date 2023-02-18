/**
 * Class used to manage modules
 */

import { ModuleBase } from "../ModuleBase";
import { EngineModules } from "../types";

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
                this.initFunctions.push(module.init.bind(module));
            }
            if (module.hasLoop) {
                this.loopFunctions.push(module.loop.bind(module));
            }
        } else {
            throw new Error("A module cannot be loaded after the modules are locked");
        }
    }

    public static lockModules(): void {
        this._allowModuleLoading = false;
    }

    public static getModules(): EngineModules {
        return Object.fromEntries(this.modules);
    }

    public static getModuleArray(): ModuleBase[] {
        return Array.from(this.modules.values());
    }

    public static getModuleByID(id: string): ModuleBase | null {
        const toRet = this.modules.get(id);
        return toRet || null;
    }
}