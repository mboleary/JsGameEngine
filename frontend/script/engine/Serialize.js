/**
 * Contains all functionality to Serialize and Deserialize GameObjects and Scripts for saving to a file, or sending over a network connection
 */

const serialTypes = {}; // Stores all Serializable types (Both GameObjects and Scripts), as well as functions to serialize and deserialize them

export const GAMEOBJECT_BLACKLIST = ["texture"];

export const SCRIPT_BLACKLIST = ["init", "loop"];

// Default Serializer function
export function defaultSerializer(keys) {
    return (obj) => {
        let json = {};
        if (obj && keys && keys.length > 0) {
            keys.forEach((key) => {
                
                let value = Reflect.get(obj, key);

                if (value && value.constructor && value.constructor.name) {
                    let name = value.constructor.name;
                    console.log("Name:", name);
                    if (serialTypes[name]) {
                        json[key] = serialTypes[name].serializer(value);
                    } else {
                        json[key] = value;
                    }
                } else {
                    json[key] = value;
                }
            });
        }
        return json;
    }
}

// Default De-Serializer Function
export function defaultDeserializer(keys, classRef) {
    return (json) => {
        let obj = new classRef(); // Hopefully the contructor does not need parameters
        // @TODO Fix handling of functions (don't allow them to be overwritten), and NULL or undefined fields coming in
        updateClassState(obj, json, keys);
        return obj;
    }
}

// Updates the state of an object
export function updateClassState(obj, state, keys) {
    Object.keys(state).forEach((key) => {
        if (keys.indexOf(key) > -1) {
            Reflect.set(obj, key, state[key]);
        }
    });
}

// Get Keys from a class
export function getKeys(classRef, blacklist) {
    // Construct the class
    let obj = new classRef();

    // Get Keys
    let keys = Reflect.ownKeys(obj);

    // Check against blacklist
    if (blacklist && blacklist.length > 0) {
        blacklist.forEach((blkey) => {
            let idx = keys.indexOf(blkey);
            if (idx >= 0) {
                keys.splice(idx, 1);
            }
        });
    }

    return keys;
}

// Makes a GameObject or Script Serializable
export function makeSerializable(classRef, serializer, deserializer) {
    let name = classRef.name;
    if (!serialTypes[name]) {
        let toAdd = {};
        toAdd.classRef = classRef; // Reference to the Constructor
        toAdd.serializer = serializer;
        toAdd.deserializer = deserializer;
        serialTypes[name] = toAdd;
    }
}

// Serializes a GameObject or Script
export function serialize(serObj, serializeChildren = true) {
    let name = serObj.constructor.name;
    let type = serialTypes[name];
    let toRet = {};

    if (!type) {
        console.error("Cannot Serialize: Not in List!", serObj);
        throw new Error("Cannot Serialize: Not in List");
    }

    toRet.type = name;
    toRet.data = type.serializer(serObj, serializeChildren);

    return toRet;
}

// Deserializes parsed JSON and returns all parsed GameObjects
export function deserialize(json) {
    let name = json.type;
    let type = serialTypes[name];
    let toRet = null;

    if (!type) {
        console.error("Cannot Deserialize: Not in List!", serObj);
        throw new Error("Cannot Deserialize: Not in List");
    }

    toRet = type.deserializer(json.data);

    return toRet;
}
