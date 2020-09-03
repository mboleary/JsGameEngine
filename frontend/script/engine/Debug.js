/**
 * Contains interfaces to assist with Debugging
 */

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './Input.js';

import { defaultSerializer, defaultDeserializer, defaultStateUpdater, getKeys, makeSerializable, serialize, deserialize } from './Serialize.js';

import { initDebug as engineDebug } from './Engine.js';

import {} from './Asset/AssetLoader.js';

export function initDebug() {
    window.debug = {};
    // Controller
    window.debug.input = {};
    window.debug.input.defineKey = defineKey;
    window.debug.input.TYPE_DIGITAL = TYPE_DIGITAL;
    window.debug.input.setKeyOnNextInput = setKeyOnNextInput;
    window.debug.input.getAllKeys = getAllKeys;
    window.debug.input.setKeybindings = setKeybindings;
    engineDebug();

    // Serialization
    let ser = {};
    ser.defaultSerializer = defaultSerializer;
    ser.defaultDeserializer = defaultDeserializer;
    ser.defaultStateUpdater = defaultStateUpdater;
    ser.getKeys = getKeys;
    ser.makeSerializable = makeSerializable;
    ser.serialize = serialize;
    ser.deserialize = deserialize;
    window.debug.serialize = ser;

    window.debug.interface = {};
    window.debug.interface.start = () => {
        let ret = window.open(window.CONFIG.debugui || "/debug.html");
        window.debug.interface.ref = ret;
    }
    initDebugInterface();
}

// Handles communication between the debug window and the Game Engine
function initDebugInterface() {
    window.addEventListener("message", (e) => {
        if (e.origin.startsWith(window.CONFIG.debugui)) {
            console.log(e);
            console.log(e.data);
            let res = handleMessage(e.data);
            console.log("Returned data:", res);
            if (res) {
                let msgToSend = {
                    number: e.data.number || undefined,
                    data: res
                }
                e.source.postMessage(msgToSend, window.CONFIG.debugui);
            }
        } else {
            console.warn("Got message from unexpected source. Do you have the correct CONFIG URL for debugui?", e.origin);
        }
    })
}

// Handles the message from the Debug Window and returns the data to send back
function handleMessage(data) {
    if (data.type === "GET") {
        let pathSplit = data.data.var;
        let rootObj = null;
        let blacklist = data.data.blacklist || null;
        let maxDepth = data.data.maxDepth || -1;
        if (data.data.from === "gameObject") {
            rootObj = window.debug.engine.getGameObjectByID(data.data.select);
            // Add a default blacklist
            if (pathSplit.length === 0) {
                blacklist = ["parent"];
            }
        } else {
            rootObj = window.debug[data.data.from];
        }
        if (rootObj) {
            let result = rootObj;
            pathSplit.forEach((item) => {
                result = rootObj[item];
            });
            console.log("Got:", result);
            return serializeForDebug(result, blacklist, maxDepth);
        }
    } else if (data.type === "SET") {
        let pathSplit = data.data.var;
        let rootObj = null;
        if (data.data.from === "gameObject") {
            rootObj = window.debug.engine.getGameObjectByID(data.data.select);
        } else {
            rootObj = window.debug[data.data.from];
        }
        if (rootObj) {
            let result = rootObj;
            // Take the last Index, since it could be an Array
            let lastIndex = pathSplit.pop();
            pathSplit.forEach((item) => {
                result = rootObj[item];
            });
            let newData = data.data.data;
            // Use the asset loader to load something in
            if (data.data.asset) {
                // @TODO Implement Asset Loading here
            }
            if (data.data.type === "push") {
                result[lastIndex].push(newData);
            } else if (data.data.type === "insert") {
                result.splice(lastIndex, 0, newData);
            } else if (data.data.type === "delete") {
                if (typeof result === "object" && Array.isArray(result)) {
                    result.splice(lastIndex, 1);
                } else {
                    delete result[lastIndex];
                }
            } else {
                // Replace
                result[lastIndex] = newData;
            }
            return result;
        }
    } else if (data.type === "ACTION") {
        let pathSplit = data.data.var;
        let rootObj = null;
        if (data.data.from === "gameObject") {
            rootObj = window.debug.engine.getGameObjectByID(data.data.select);
        } else {
            rootObj = window.debug[data.data.from];
        }
        if (rootObj) {
            let result = rootObj;
            pathSplit.forEach((item) => {
                result = rootObj[item];
            });
            if (typeof result === "function") {
                return result(...data.params);
            }
        }
    } else if (data.type === "PING") {
        return true;
    }
}

// MAkes a GameObject or whatever serializable. Also can blacklist keys in an object
export function serializeForDebug(source, blacklist = [], maxDepth = -1) {
    let visited = [];
    let visitedKeys = []; // Stores the keys of the visited Objects
    let extra = [];
    function helper(root, pathArr, depth) {
        console.log("helper:", root, pathArr);
        // Check Max Depth
        if (maxDepth >= 0 && depth > maxDepth) return;
        // Check Blacklist
        if (blacklist && pathArr.length === 1 && blacklist.indexOf(pathArr[0]) >= 0) {
            return;
        }
        if (!root && root !== 0) return;
        if (typeof root === "object" && !Array.isArray(root)) {
            let newObj = {};
            if (visited.indexOf(root) === -1) {
                visited.push(root);
                visitedKeys.push(pathArr);
                let keys = Reflect.ownKeys(root);
                keys.forEach((key) => {
                    let value = root[key];
                    newObj[key] = helper(value, pathArr.concat([key]), depth + 1);
                });
                return newObj;
            } else {
                let idx = visited.indexOf(root);
                let key = visitedKeys[idx];
                extra.push({
                    key: pathArr,
                    type: "ref",
                    to: key
                });
                return;
            }
        } else if (typeof root === "object" && Array.isArray(root)) {
            let newObj = [];
            root.forEach((item, index) => {
                newObj.push(helper(item, pathArr.concat([index]), depth + 1));
            });
            return newObj;
        } else if (typeof root === "function") {
            extra.push({
                key: pathArr,
                type: "function"
            });
            return;
        } else {
            return root;
        }
    }
    let data = helper(source, [], 0);
    if (source.constructor && source.constructor.name) {
        return {
            constructor: source.constructor.name,
            data: data,
            extra: extra
        };
    }
    return {
        data: data,
        extra: extra
    };
}

window.serializeForDebug = serializeForDebug;