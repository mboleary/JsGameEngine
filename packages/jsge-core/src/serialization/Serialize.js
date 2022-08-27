/**
 * Handles serializing and getting a partial state
 */

import {getSerializableType} from "./Types";
import {} from "./common";

// Serializes a GameObject or Script
export function serialize(serObj, serializeChildren = true, typeName) {
    let name = typeName || serObj.constructor.name;
    let type = getSerializableType(name);
    let toRet = {};

    if (!type) {
        console.error("Cannot Serialize: Not in List!", serObj, typeName);
        throw new Error("Cannot Serialize: Not in List");
    }

    toRet.type = name;
    toRet.data = type.serializer(serObj, serializeChildren);

    return toRet;
}

/**
 * Default Serializer function
 * 
 * The Default Serializer will not perform 'Deep Serialization', where keys that are Arrays/Objects/etc. would be serialized. 
 * If this functionality is needed, consider writing a custom serializer.
 * @param {Array} keys Keys of the object to save
 * @returns {Function} Serializer function
 */
export function defaultSerializer(keys, serializeChildren) {
    /**
     * Serializer function
     * @param {Object} Object to Serialize
     * @param {Boolean} serializeChildren True if the children should be serialized
     * @returns {Object} Serialized Object
     */
    return (obj) => {
        let toRet = {};
        let data = {};
        let serKeys = {};
        toRet.type = obj.constructor.name;
        if (obj && keys && keys.length > 0) {
            keys.forEach((key) => {
                
                let value = Reflect.get(obj, key);

                // Don't overwrite functions
                if (value instanceof Function) {
                    return;
                }

                if (value && value.constructor && value.constructor.name) {
                    let name = value.constructor.name;
                    console.log("Name:", name);
                    // Note: This only serializes the value if it is not in an Array/Object/etc.
                    if (serializeChildren && serialTypes[name]) {
                        data[key] = serialTypes[name].serializer(value);
                    } else {
                        data[key] = value;
                    }
                } else {
                    data[key] = value;
                }
            });
        }
        toRet.data = data;
        return toRet;
    }
}
