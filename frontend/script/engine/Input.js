/**
 * Provides Input management for the Game Engine
 */

const keymap = {}; // Contains the mapping of keys to key names
const keystate = {}; // Contains the Key State
const keys = {}; // Contains the Key Type, and mapping

export const TYPE_DIGITAL = 1;
export const TYPE_ANALOG = 2;

let setOnNextInput = ""; // Set this key on next input

let setOnNextResolver = null;
let setOnNextRejector = null;

// Set the Binding of a key
export function setKey(name, deviceID, buttonID, buttonName) {
    if (keys[name]) {
        console.log("Key Set", deviceID, buttonID, buttonName);
        keymap[deviceID][buttonID] = name;
        keystate[name] = 0;
        let res = keys[name];
        res.mapping = [deviceID, buttonID];
        res.mappingName = buttonName;
    }
}

// Gets state of a key
export function getKeyState(name) {
    return keystate[name];
}

// Defines a new key
export function defineKey(name, type) {
    keystate[name] = 0;
    keys[name] = {};
    keys[name].type = type;
}

// Get Information and state of all keys. Useful for a set key screen, or saving key bindings
export function getAllKeys() {
    let toRet = {};
    console.log("Keymap:", keymap);
    console.log("Keystate:", keystate);
    console.log("keys:", keys);
    Object.keys(keys).forEach((key) => {
        toRet[key] = {};
        toRet[key].state = keystate[key];
        toRet[key].mapping = keys[key].mapping;
        toRet[key].mappingName = keys[key].mappingName;
        toRet[key].type = keys[key].type;
    });
    return toRet;
}

// Sets Keybindings from a saved Object
export function setKeybindings(keyBindingObj) {
    if (!keyBindingObj) return;
    Object.keys(keyBindingObj).forEach((key) => {
        let curr = keyBindingObj[key];
        keys[key] = {};
        keys[key].type = curr.type;
        keys[key].mapping = curr.mapping;
        keys[key].mappingName = curr.mappingName;
        console.log(curr.mapping)
        if (curr.mapping && curr.mapping.length) {
            let m = curr.mapping; // [DeviceID, ButtonID]
            if (!keymap[m[0]] || !Object.keys(keymap[m[0]])) {
                keymap[m[0]] = {};
            }
            keymap[m[0]][m[1]] = key;
        }
        keystate[key] = 0;
    })
}

// Sets the next key or button press to the specified name
export function setKeyOnNextInput(name) {
    setOnNextInput = name;
    return new Promise((res, rej) => {
        setOnNextResolver = res;
        setOnNextRejector = rej;
    });
}

export function cancelSetOnNextInput() {
    setOnNextRejector("Set Event Cancelled");
    setOnNextResolver = null;
    setOnNextInput = "";
    setOnNextRejector = null;
}

export function setKeyState(name, state) {
    keystate[name] = state;
}

window.addEventListener('keydown', (event) => {
    let code = event.keyCode;
    let name = event.key;

    if (setOnNextInput && setOnNextResolver) {
        if (!keymap['k']) keymap['k'] = {};
        keymap[`k`][code] = setOnNextInput;
        setKey(setOnNextInput, 'k', code, name);
        setOnNextResolver(code);
        setKeyOnNextInput = "";
        setOnNextRejector = null;
        setOnNextResolver = null;
    } else if (keymap[`k`][code]) {
        keystate[keymap[`k`][code]] = 1;
    }
})

window.addEventListener('keyup', (event) => {
    let code = event.keyCode;
    if (keymap[`k`][code]) {
        keystate[keymap[`k`][code]] = 0;
    }
})

//@TODO finish this