import { Script } from "../components";
import { ModuleBase } from "../ModuleBase";

/**
 * This is an internal module which runs the scripts
 */
export class ScriptManagerModule extends ModuleBase {
    readonly _name = "ScriptManager";
    readonly _id = "script";
    readonly _debugName = "script";
    readonly _version = "0.0.0";
    readonly _meta = {};
    readonly hasLoop = true;

    private static readonly scriptMap: Map<string, Script> = new Map();

    loop() {
        for (const script of ScriptManagerModule.scriptMap.values()) {
            script.loop();
        }
    }

    enrollScriptComponent(script: Script) {
        ScriptManagerModule.scriptMap.set(script.id, script);
    }

    removeScriptComponent(script: Script) {
        ScriptManagerModule.scriptMap.delete(script.id);
    }
}