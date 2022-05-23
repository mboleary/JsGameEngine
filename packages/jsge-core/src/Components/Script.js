/**
 * Interface for providing script functionality to GameObjects
 */

// import uuid from './UUID.js';
import uuid from "uuid/dist/esm-browser/v4";
import ComponentBase from "../ComponentBase";

export default class Script extends ComponentBase {
    constructor({...params}) {
        super({...params});
        this._priority = 1;
    }

    // Override this to initialize a script
    init() {

    }

    // Override this to perform a check during the gameLoop
    loop() {

    }

    // Called before the object is destroyed
    onDestroy() {

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
