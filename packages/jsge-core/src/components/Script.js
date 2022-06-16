/**
 * Interface for providing script functionality to GameObjects
 */

import ComponentBase from "../ComponentBase";
import {enrollScriptComponent, removeScriptComponent} from "../ScriptManager";

export default class Script extends ComponentBase {
    constructor({...params} = {}) {
        super({...params});
        this._priority = 1;
        
    }

    init() {
        enrollScriptComponent(this);
        if (super.init) super.init();
        this.onInit()
    }

    // Override this to initialize a script
    onInit() {

    }

    // Override this to perform a check during the gameLoop
    loop() {

    }

    // Called before the object is destroyed
    onDestroy() {

    }

    destroy() {
        removeScriptComponent(this);
        this.onDestroy();
    }
}

export const AsyncScript = Base => class extends Base {
    // override this to get an async Loop
    async asyncLoop() {

    }

    // Removes access to sync loop so that we can so async stuff
    loop() {
        // Execute the syncronous loop first, if there is one
        if (super.loop) {
            super.loop();
        }
        setTimeout(async () => {
            this.asyncLoop();
        });
    }
}
