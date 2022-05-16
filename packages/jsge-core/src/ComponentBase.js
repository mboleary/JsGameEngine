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
    }
}