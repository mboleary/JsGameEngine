/**
 * Definitions for a GameObject
 */

import Transform from './Transform.js';
// import uuid from './UUID.js';
import uuid from "../node_modules/uuid/dist/esm-browser/v4.js";

export default class GameObject {
    constructor() {
        // Public
        this.transform = new Transform(); // Position, Rotation, and Scale Relative to Parent, if any
        
        this.name = ""; // Name of the GameObject
        this.group = ""; // Name of the Group the GameObject belongs to

        // Private @TODO find a way to trim out these variables from scripts
        this.id = uuid(); // This should be unique, as this is how the gameObject will be serialized
        this.zIndex = 0; // Used for order of rendering in 2D
        this.priority = 0; // Determines the priority of the scripts.
        this.parent = null; // Contains reference to the Parent GameObject
        // this.deleteFlag = false; // True if the GameObject should be destroyed.
        this.children = []; // Child GameObjects whose transformation will be relative to that of this GameObject
        this.components = []; // Components of the GameObject
    }

    // Attaches a GameObject to this GameObject
    attachGameObject(go) {
        go.parent = this;
        this.children.push(go);
    }

    // Attaches a Component to this GameObject
    attachComponent(scr) {
        scr.gameObject = this;
        this.components.push(scr);
        scr.init();
    }

    // Removes a Script already attached to this GameObject
    detachComponent(scr) {
        if (scr.id) {
            for (let i = 0; i < this.components.length; i++) {
                let component = this.components[i];
                if (component.id === scr.id) {
                    this.components.splice(i, 1);
                    component.onDestroy();
                    return;
                }
            }
        }
    }

    getComponentByID(id) {
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            if (component.id === id) {
                return component;
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
    // beforeDestroy() {
    //     if (this.components && this.components.length) {
    //         this.components.forEach((script) => {
    //             script.onDestroy();
    //         });
    //     }
    // }
}