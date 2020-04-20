/**
 * Contains interfaces to assist with Debugging
 */

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './Input.js';

import { initDebug as engineDebug } from './Engine.js';

export function initDebug() {
    if (window) {
        window.debug = {};
        // Controller
        window.debug.input = {};
        window.debug.input.defineKey = defineKey;
        window.debug.input.TYPE_DIGITAL = TYPE_DIGITAL;
        window.debug.input.setKeyOnNextInput = setKeyOnNextInput;
        window.debug.input.getAllKeys = getAllKeys;
        window.debug.input.setKeybindings = setKeybindings;
        engineDebug();
    }
}