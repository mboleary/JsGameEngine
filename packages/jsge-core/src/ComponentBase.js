/**
 * Contains the component class
 */

import uuid from "uuid/dist/esm-browser/v4";

const PREFIX = "comp-";

export default class ComponentBase {
    constructor({name, gameObject}) {
        this.id = PREFIX + uuid();
        this.name = name;
        this.gameObject = gameObject;
        this._attrName = null; // Name of attribute that will be created on the GameObject
        this._attrSet = false; // true when the attribute has been set successfully
    }

    // Function called when component created
    init () {

    }

    // Function called when component destroyed
    destroy () {

    }
}