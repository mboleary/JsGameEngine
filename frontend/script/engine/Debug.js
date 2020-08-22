/**
 * Contains interfaces to assist with Debugging
 */

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './Input.js';

import { defaultSerializer, defaultDeserializer, defaultStateUpdater, getKeys, makeSerializable, serialize, deserialize } from './Serialize.js';

import { initDebug as engineDebug } from './Engine.js';

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
        let ret = window.open("/debug.html");
        window.debug.interface.ref = ret;
    }
}
