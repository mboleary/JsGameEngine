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

    // Override this to do Physics stuff
    physicsLoop() {

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

// Provide a class misin that allows all code for a GameObject to be in one place
export const GameObjectWithScript = Base => class extends Base {
    constructor() {
        super();
        this.internalScript = new Script();
        this.internalScript.init = this.init;
        this.internalScript.loop = this.loop;
        this.internalScript.physicsLoop = this.physicsLoop;
        this.scripts.push(this.internalScript);
    }

    init() { }

    loop() { }

    physicsLoop() { }
}