/**
 * Class used to handle engine-based events
 */

export class EngineEventManager {
    private static readonly initFunctions: Function[] = [];

    public static onInit(func: Function): void {
        if (func) {
            this.initFunctions.push(func);
        }
    };

    // For use in the engine only
    public static callInitFunctions() {
        for (const func of this.initFunctions) {
            func();
        }
    }


}