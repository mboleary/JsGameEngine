/**
 * Definitions for a GameObject
 */

import Transform from './Transform.js';
import uuid from './UUID.js';

export default class GameObject {
    constructor() {
        // Public
        this.scripts = [];
        this.colliders = []; // @TODO Figure out a good way to build colliders
        this.texture = null; // @TODO Add a texture here
        this.transform = new Transform();
        this.children = []; // Child GameObjects whose transformation will be relative to that of this GameObject
        this.name = ""; // NAme of the GameObject

        // Private @TODO find a way to trim out these variables from scripts
        this.id = uuid(); // This should be unique, as this is how the gameObject will be serialized
        this.zIndex = 0; // Used for order of rendering in 2D
        this.priority = 0; // Determines the priority of the scripts.
        this.parent = null; // Contains reference to the Parent GameObject
        this.deleteFlag = false; // True if the GameObject should be destroyed.
    }

    attachGameObject(go) {
        go.parent = this;
        this.children.push(go);
    }

    attachScript(scr) {
        scr.gameObject = this;
        this.scripts.push(scr);
        scr.init();
    }

    // // Queue this GameObject for deletion
    // destroy() {

    // }

    // // Add a script during runtime, and enroll in the engine
    // addScript() {

    // }
}