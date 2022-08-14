/**
 * Definitions for a GameObject
 */

// import Transform from './Transform.js';
// import uuid from './UUID.js';
import {v4 as uuid} from "uuid";

const KEY_BLACKLIST = ["name", "group", "id", "parent", "children", "components"];

export default class GameObject {
    constructor({name = "", group = "", id} = {}) {
        // Public
        // this.transform = new Transform(); // Position, Rotation, and Scale Relative to Parent, if any
        
        this.name = name; // Name of the GameObject
        this.group = group; // Name of the Group the GameObject belongs to

        // Private @TODO find a way to trim out these variables from scripts
        this.id = id || uuid(); // This should be unique, as this is how the gameObject will be serialized
        this.zIndex = 0; // Used for order of rendering in 2D @TODO remove
        this.priority = 0; // Determines the priority of the scripts. @TODO remove
        this.parent = null; // Contains reference to the Parent GameObject
        // this.deleteFlag = false; // True if the GameObject should be destroyed.
        this.children = []; // Child GameObjects whose transformation will be relative to that of this GameObject
        this.components = []; // Components of the GameObject
        this._initialized = false;

        // this = {test: true};
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
        if (this._initialized) {
            console.log("comp added after init");
            scr.init();
        }
        if (scr._attrName && !(scr._attrName in KEY_BLACKLIST)) {
            this[scr._attrName] = scr;
            scr._attrSet = true;
        }
    }

    // Removes a Script already attached to this GameObject
    detachComponent(scr) {
        if (scr.id) {
            for (let i = 0; i < this.components.length; i++) {
                let component = this.components[i];
                if (component.id === scr.id) {
                    this.components.splice(i, 1);
                    component.onDestroy();
                    break;
                }
            }
            if (scr._attrSet && !scr._attrName in KEY_BLACKLIST) {
                delete this[scr._attrName];
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

    getComponentByType(typename) {
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            if (component.constructor?.name === typename) {
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

    // Called to initialize the Components
    initialize() {
        if (this.components && this.components.length) {
            this.components.forEach((c) => {
                c.init();
            });
        }
        this._initialized = true;
    }

    // Called before this GameObject is deleted
    beforeDestroy() {
        if (this.components && this.components.length) {
            this.components.forEach((c) => {
                c.destroy();
            });
        }
    }
}