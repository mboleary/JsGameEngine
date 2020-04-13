/**
 * Interface for providing script functionality to GameObjects
 */

export default class Script {
    constructor(gameObject) {
        this.gameObject = gameObject; // Reference to the GameObject that this script is attached to
    }

    // Override this to initialize a script
    init() {

    }

    // Override this to perform a check during the gameLoop
    loop() {

    }
}

export class AsyncScript extends Script {
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