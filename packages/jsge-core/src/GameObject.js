/**
 * Definitions for a GameObject
 */

import Transform from './Transform.js';
// import uuid from './UUID.js';
import {v4 as uuid} from "uuid";

export default class GameObject {
    constructor() {
        // Public
        this.scripts = [];
        this.colliders = []; // @TODO Figure out a good way to build colliders
        this.texture = null; // @TODO Add a texture here
        this.transform = new Transform(); // Position, Rotation, and Scale Relative to Parent, if any
        this.children = []; // Child GameObjects whose transformation will be relative to that of this GameObject
        this.name = ""; // Name of the GameObject
        this.group = ""; // Name of the Group the GameObject belongs to

        // Private @TODO find a way to trim out these variables from scripts
        this.id = uuid(); // This should be unique, as this is how the gameObject will be serialized
        this.zIndex = 0; // Used for order of rendering in 2D
        this.priority = 0; // Determines the priority of the scripts.
        this.parent = null; // Contains reference to the Parent GameObject
        // this.deleteFlag = false; // True if the GameObject should be destroyed.
    }

    // Attaches a GameObject to this GameObject
    attachGameObject(go) {
        go.parent = this;
        this.children.push(go);
    }

    // Attaches a Script to this GameObject
    attachScript(scr) {
        scr.gameObject = this;
        this.scripts.push(scr);
        scr.init();
    }

    // Removes a Script already attached to this GameObject
    detachScript(scr) {
        if (scr.id) {
            for (let i = 0; i < this.scripts.length; i++) {
                let script = this.scripts[i];
                if (script.id === scr.id) {
                    this.scripts.splice(i, 1);
                    script.onDestroy();
                    return;
                }
            }
        }
    }

    getScriptByID(id) {
        for (let i = 0; i < this.scripts.length; i++) {
            let script = this.scripts[i];
            if (script.id === id) {
                return script;
            }
        }
    }

    // Detaches a GameObject attached to this GameObject. Warning: This will make the child GameObject an orphan!
    detachGameObject(go) {
        go.parent = null;
        for (let i = 0; i < this.children.length; i++) {
            if (go.id === this.children[i].id) {
                this.children.splice(i, 1);
                return;
            }
        }
    }

    // Called before this GameObject is deleted
    beforeDestroy() {
        if (this.scripts && this.scripts.length) {
            this.scripts.forEach((script) => {
                script.onDestroy();
            });
        }
    }
}