/**
 * Contains the component class
 */

import {v4 as uuid} from "uuid";

const PREFIX = "comp-";

export default class ComponentBase {
    constructor({name, gameObject, attribute = null} = {}) {
        this.id = PREFIX + uuid();
        this.name = name;
        this.gameObject = gameObject;
        this._attrName = attribute; // Name of attribute that will be created on the GameObject
        this._attrSet = false; // true when the attribute has been set successfully
    }

    /**
     * Function called when Component initialized
     */
    _init () {

    }

    /**
     * Public-facing function for component initialization
     */
    init() {}

    /**
     * Function called when component is destroyed
     */
    _destroy () {

    }

    /**
     * Public-facing function for component destruction
     */
    destroy() {}
}