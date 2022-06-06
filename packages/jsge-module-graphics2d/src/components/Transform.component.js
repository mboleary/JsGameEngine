import ComponentBase from "jsge-core/src/ComponentBase.js";
import Transform from "../Transform";

/**
 * A Transform holds position, rotation, and Scale data for an object
 * @TODO Rewrite to use gl-matrix behind the scenes
 */
export default class TransformComponent extends ComponentBase {
    constructor(...params) {
        super(...params);

        this.value = new Transform(); // Actual transform value
        this._absolute = new Transform(); // Absolute position with parent values added
    }
}
