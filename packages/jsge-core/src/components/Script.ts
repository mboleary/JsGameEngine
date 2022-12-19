/**
 * Interface for providing script functionality to GameObjects
 */

import {ComponentBase} from "../ComponentBase";
import {enrollScriptComponent, removeScriptComponent} from "../ScriptManager";

export class Script extends ComponentBase {
    public readonly priority: number;
    constructor({priority = 0, ...params} = {}) {
        super({...params});
        this.priority = priority;
    }

    _init() {
        enrollScriptComponent(this);
        // if (super._init) super._init();
        this.init()
    }

    // Override this to initialize a script
    init() {

    }

    // Override this to perform a check during the gameLoop
    loop() {

    }

    // Called before the object is destroyed
    destroy() {

    }

    _destroy() {
        removeScriptComponent(this);
        this.destroy();
    }
}

export abstract class AsyncScript extends Script {
    // override this to get an async Loop
    abstract asyncLoop(): Promise<void>;

    // Removes access to sync loop so that we can so async stuff
    loop() {
        setTimeout(async () => {
            this.asyncLoop();
        });
    }
}

export default Script;
