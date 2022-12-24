import ComponentBase from "jsge-core/src/ComponentBase.js";
import Transform from "../Transform";
import { addSerializableType } from 'jsge-core/src/serialization';

/**
 * A Transform holds position, rotation, and Scale data for an object
 * @TODO Rewrite to use gl-matrix behind the scenes
 */
export class TransformComponent extends ComponentBase {
    constructor({name = "transform", ...params} = {}) {
        super({...params, attribute: "transform"});

        this.value = new Transform(); // Actual transform value
        this._absolute = new Transform(); // Absolute position with parent values added
    }
}

// Serialization code

const keys = [
    "id",
    "name",
    "value"
];

function serializer(obj) {
    const toRet = {};
    keys.forEach((key) => {
        toRet[key] = obj[key];
    });
    return toRet;
}

function deserializer(json) {
    const toRet = new TransformComponent();
    keys.forEach((key) => {
        if (json[key]) {
            if (key === "value") {
                toRet.value.deepCopy(json[key]);
            } else {
                Reflect.set(toRet, key, json[key]);
            }
        }
    });
    return toRet;
}

function stateUpdater(obj, state) {
    keys.forEach((key) => {
        if (state[key]) {
            if (key === "value") {
                obj.value.deepCopy(state.value);
            } else {
                Reflect.set(obj, key, state[key]);
            }
        }
    });
    return obj;
}

addSerializableType({
    typename: "TransformComponent",
    classRef: TransformComponent, 
    serializer, 
    deserializer, 
    stateUpdater, 
    keys
});
