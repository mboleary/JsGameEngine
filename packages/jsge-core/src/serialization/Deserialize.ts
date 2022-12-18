/**
 * Handles Deserialization
 */
import { GameObject } from "../GameObject";
import { PrefabComponentDefinition } from "../types/prefab";
import {getSerializableType} from "./Types";

 // Deserializes parsed JSON and returns all parsed GameObjects
export function deserialize(json: PrefabComponentDefinition, typeName?: string) {
    let name = typeName || json.type;
    let type = getSerializableType(name);
    let toRet = null;

    if (!type) {
        console.error("Cannot Deserialize: Not in List!", name);
        throw new Error("Cannot Deserialize: Not in List");
    }

    toRet = type.deserializer(json.data || {});

    return toRet;
}

// Updates a GameObject with a given state (Like Deserialize, but the object is not instanciated)
export function update(obj: GameObject, state, typeName: string) {
    let name = typeName || state.type;
    let type = getSerializableType(name);

    if (!type) {
        console.error("Cannot Update State: Not in List!", name);
        throw new Error("Cannot Update State: Not in List");
    }

    return type.stateUpdater(obj, state.data);
}

/**
 * Default De-Serializer Function
 * @param {Array} keys Keys to use in deserialization
 * @param {Class} classRef Reference to the class constructor
 * @returns {Function} Function used to deserialize an object
 */
export function defaultDeserializer(keys, classRef) {
    /**
     * Deserializes an Object, given the serial data
     * @param {Object} json Serial Data
     * @returns {Object} Deserialized object
     */
    return (json) => {
        let obj = new classRef(); // Hopefully the contructor does not need parameters
        // @TODO Fix handling of functions (don't allow them to be overwritten), and NULL or undefined fields coming in
        Object.keys(json).forEach((key) => {
            if (!json[key]) delete json[key];
        })

        defaultStateUpdater(obj, json, keys);
        return obj;
    }
}

// Updates the state of an object
export function defaultStateUpdater(obj, state, keys) {
    if (keys) {
        Object.keys(state).forEach((key) => {
            if (keys.indexOf(key) > -1) {
                Reflect.set(obj, key, state[key]);
            }
        });
    } else {
        Object.keys(state).forEach((key) => {
            Reflect.set(obj, key, state[key]);
        });
    }
    return obj;
}
