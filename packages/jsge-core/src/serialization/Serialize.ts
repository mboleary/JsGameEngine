/**
 * Handles serializing and getting a partial state
 */

import { SerializedData } from "../types/serialization";
import {getSerializableType} from "./Types";


// Serializes a GameObject or Script
export function serialize<T extends object>(serObj: T, serializeChildren = true, typeName: string): SerializedData {
    let name = typeName || serObj.constructor.name;
    let type = getSerializableType(name);

    if (!type) {
        console.error("Cannot Serialize: Not in List!", serObj, typeName);
        throw new Error("Cannot Serialize: Not in List");
    }

    return {
        type: name,
        data: type.serializer(serObj, serializeChildren)
    };
}

/**
 * Default Serializer function
 * 
 * The Default Serializer will not perform 'Deep Serialization', where keys that are Arrays/Objects/etc. would be serialized. 
 * If this functionality is needed, consider writing a custom serializer.
 * @param {Array} keys Keys of the object to save
 * @returns {Function} Serializer function
 */
export function defaultSerializer<T extends object>(keys: string[], serializeChildren: boolean) {
    /**
     * Serializer function
     * @param {Object} Object to Serialize
     * @param {Boolean} serializeChildren True if the children should be serialized
     * @returns {Object} Serialized Object
     */
    return (obj: T) => {
        let data = {};
        let serKeys = {};
        if (obj && keys && keys.length > 0) {
            keys.forEach((key) => {
                
                let value = Reflect.get(obj, key);

                // Don't overwrite functions
                if (value instanceof Function) {
                    return;
                }

                // @TODO re-add this during refactoring serialization

                // if (value && value.constructor && value.constructor.name) {
                //     let name = value.constructor.name;
                //     console.log("Name:", name);
                //     // Note: This only serializes the value if it is not in an Array/Object/etc.
                //     if (serializeChildren && serialTypes[name]) {
                //         data[key] = serialTypes[name].serializer(value);
                //     } else {
                //         data[key] = value;
                //     }
                // } else {
                //     data[key] = value;
                // }
            });
        }
        return {
            type: obj.constructor.name,
            data
        }
    }
}
