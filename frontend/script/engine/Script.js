/**
 * Interface for providing script functionality to GameObjects
 */

import uuid from './UUID.js';

export default class Script {
    constructor(gameObject) {
        this.gameObject = gameObject; // Reference to the GameObject that this script is attached to
        this.id = uuid();
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

// Provide a class misin that allows all code for a GameObject to be in one place
export const GameObjectWithScript = Base => class extends Base {
    constructor() {
        super();
        this.internalScript = new Script();
        // Binding to the new 'this' is a must for inheritance to work properly
        this.internalScript.init = this.init.bind(this);
        this.internalScript.loop = this.loop.bind(this);
        this.internalScript.physicsLoop = this.physicsLoop.bind(this);
        this.internalScript.onDestroy = this.onDestroy.bind(this);
        this.scripts.push(this.internalScript);
        this.gameObject = this;
    }

    init() { }

    loop() { }

    physicsLoop() { }

    onDestroy() { }
}