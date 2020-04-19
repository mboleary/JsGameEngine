/**
 * Provides Input management for the Game Engine
 */

const keymap = {}; // Contains the mapping of keys to key names
const keystate = {}; // Contains the Key State
const keys = {}; // Contains the Key Type, and mapping

export const TYPE_DIGITAL = 1; // Values are either 0 or 1
export const TYPE_ANALOG = 2; // Values range from -1 to 1. Buttons can be mapped to + or - 1

let setOnNextInput = ""; // Set this key on next input

let setOnNextResolver = null;
let setOnNextRejector = null;

let gamepadConnected = 0;
let gamePadsBound = []; // Stores indicies of all gamepads bound. This is done for Chromium support

export function initInput() {
    // Chrome does Gamepads differently than Firefox
    // @TODO implement Chrome-supported Gamepad API
}

// @TODO Function to bind key by name
export function setKey() {}

// Set the Binding of a key for a keyboard
function setKeyFromKbd(name, buttonID, buttonName) {
    if (keys[name]) {
        console.log("Key Set From Keyboard", buttonID, buttonName);
        if (!keymap['k']) keymap['k'] = {};
        keymap['k'][buttonID] = name;
        keystate[name] = 0;
        let res = keys[name];
        res.mapping = ['k', buttonID];
        res.mappingName = buttonName;
    }
}

function setKeyFromGamepad(name, deviceID, buttonID, axisID, axisPositive) {
    if (keys[name]) {
        if (!keymap[deviceID]) keymap[deviceID] = {};
        if (!keymap[deviceID][0]) keymap[deviceID][0] = {};
        if (!keymap[deviceID][1]) keymap[deviceID][1] = {};
        let res = keys[name];
        console.log("Key Set From Gamepad", deviceID, buttonID, axisID);
        if (res.type === TYPE_ANALOG) {
            // Mapping for Buttons to Axis are handled entirely by the name
            if (buttonID || buttonID === 0) {
                // Button -> Axis
                keymap[deviceID][0][buttonID] = name;
                res.mapping = [deviceID, 0, buttonID];
                res.mappingName = "Button " + buttonID;
            } else if (axisID || axisID === 0) {
                // Axis -> Axis
                keymap[deviceID][1][axisID] = name;
                res.mapping = [deviceID, 1, buttonID];
                res.mappingName = "Axis " + buttonID;
            }
        } else {
            // Mapping an Axis to a button is done by checking the direction of the axis
            if (buttonID || buttonID === 0) {
                // Button -> Button
                keymap[deviceID][0][buttonID] = name;
                res.mapping = [deviceID, 0, buttonID];
                res.mappingName = "Button " + buttonID;
            } else if (axisID || axisID === 0) {
                // Axis -> Button
                if (!keymap[deviceID][1][axisID] || Object.keys(keymap[deviceID][1][axisID]).length === 0) keymap[deviceID][1][axisID] = {};
                if (axisPositive) {
                    keymap[deviceID][1][axisID]["pos"] = name;
                    res.mapping = [deviceID, 1, buttonID, "pos"];
                } else {
                    keymap[deviceID][1][axisID]["neg"] = name;
                    res.mapping = [deviceID, 1, buttonID, "neg"];
                }
                res.mappingName = "Axis " + buttonID + (axisPositive ? "+" : "-");
                console.log(keymap[deviceID])
            }
        }
        keystate[name] = 0;
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
        // @TODO Make this work with Gamepads
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
        // Note: Handle Settings Axes by giving the correct name to set with the (+/-)
        setKeyFromKbd(setOnNextInput, code, name);
        setOnNextResolver(code);
        setKeyOnNextInput = "";
        setOnNextRejector = null;
        setOnNextResolver = null;
    } else if (keymap['k'] && keymap['k'][code]) {
        let name = keymap['k'][code];
        if (keys[name].type === TYPE_ANALOG) {
            // Check for the + or -
            if (name.charAt(name.length() - 1) === "-") {
                keystate[name.substring(0, name.length())] = -1;
            } else {
                keystate[name.substring(0, name.length())] = 1;
            }
        } else {
            keystate[name] = 1;
        }
    }
});

window.addEventListener('keyup', (event) => {
    let code = event.keyCode;
    if (keymap['k'] && keymap['k'][code]) {
        keystate[keymap['k'][code]] = 0;
    }
});

window.addEventListener("gamepadconnected", (e) => {
    gamepadConnected += 1;
    gamePadsBound.push(e.gamepad.index);
    console.log("Gamepad Connected:", e);
});

window.addEventListener("gamepaddisconnected", (e) => {
    gamepadConnected -= 1;
    let idx = gamePadsBound.indexOf(e.gamepad.index);
    if (idx >= 0) {
        delete gamePadsBound[idx];
    }
    console.log("Gamepad Disconnected:", e);
});

// Polls the state of the gamepads. Do this every frame.
export function pollGamepads() {
    if (gamepadConnected <= 0) {
        return;
    }

    // Note: Chrome doesn't provide indicies for this. Use Index to get the gamepad
    let gamepads = navigator.getGamepads(); // @TODO For legacy purposes, implement the webkit-prefixed version of this

    if (gamepads.length === 0 || gamePadsBound.length === 0) {
        return;
    }

    // console.log(gamepads);

    if (setOnNextInput && setOnNextResolver) {
        // Set an input
        for (let i = 0; i < gamepads.length; i++) {
            let gp = gamepads[i];
            if (gp.buttons) {
                // Buttons are stored by index
                for (let j = 0; j < gp.buttons.length; j++) {
                    let btn = gp.buttons[j];
                    if (btn.pressed) {
                        // Note: Handle Settings Axes by giving the correct name to set with the (+/-)
                        // if (!keymap[gp.id]) keymap[gp.id] = {};
                        // if (!keymap[gp.id][0]) keymap[gp.id][0] = {};
                        // keymap[gp.id][0][j] = setOnNextInput;
                        // setKey(setOnNextInput, gp.id, j, "Button " + j);
                        setKeyFromGamepad(setOnNextInput, gp.id, j);
                        setOnNextResolver(j);
                        setKeyOnNextInput = "";
                        setOnNextRejector = null;
                        setOnNextResolver = null;
                        return;
                    }
                }
            }
            // Axes also stored by index
            if (gp.axes) {
                for (let j = 0; j < gp.axes.length; j++) {
                    let axis = gp.axes[j];
                    // @TODO Check MArgin of Error
                    if (axis !== 0) {
                        setKeyFromGamepad(setOnNextInput, gp.id, null, j, axis > 0);
                        setOnNextResolver(j);
                        setKeyOnNextInput = "";
                        setOnNextRejector = null;
                        setOnNextResolver = null;
                        return;
                    }
                }
            }
        }
    } else {
        // Look for input
        for (let i = 0; i < gamepads.length; i++) {
            let gp = gamepads[i];
            if (keymap[gp.id]) {
                // Check For Mapped Buttons
                if (keymap[gp.id][0] && gp.buttons) {
                    for (let j = 0; j < gp.buttons.length; j++) {
                        let btn = gp.buttons[j];
                        // Buttons stored under keymap[<ID>][0]
                        if (keymap[gp.id][0][j]) {
                            let name = keymap[gp.id][0][j];
                            // Get Type of Button
                            let keytype = keys[name].type;
                            if (btn.pressed) {
                                // For Analog AXIS types, allow binding buttons to +/- 1 values
                                if (keytype === TYPE_ANALOG) {
                                    if (name.charAt(name.length - 1) === "-") {
                                        keystate[name.substring(0, name.length - 1)] = -1;
                                    } else {
                                        keystate[name.substring(0, name.length - 1)] = 1;
                                    }
                                } else {
                                    keystate[name] = 1;
                                }
                            } else {
                                // Reset Button if not pressed
                                if (keytype === TYPE_ANALOG) {
                                    keystate[name.substring(0, name.length() - 1)] = 0;
                                } else {
                                    keystate[name] = 0;
                                }
                            }
                        }
                    }
                }
                // Check for Mapped Axes
                if (keymap[gp.id][1] && gp.axes) {
                    for (let j = 0; j < gp.axes.length; j++) {
                        let axis = gp.axes[j];
                        let axisSetting = keymap[gp.id][1][j]; // Either a keyname, or Object
                        if (axisSetting) {
                            // @TODO Check Dead Zone
                            if (axis === 0) {
                                // Reset Buttons back to 0
                                if (axisSetting.pos || axisSetting.neg) {
                                    if (axisSetting.pos) {
                                        keystate[axisSetting.pos] = 0;
                                    }
                                    if (axisSetting.neg) {
                                        keystate[axisSetting.neg] = 0;
                                    }
                                } else {
                                    keystate[axisSetting] = 0;
                                }
                            } else {
                                // Axis has a value
                                if (axisSetting.pos || axisSetting.neg) {
                                    // This is an axis bound to a button
                                    if (axis > 0 && axisSetting.pos) {
                                        keystate[axisSetting.pos] = 1;
                                        if (axisSetting.neg) {
                                            keystate[axisSetting.neg] = 0;
                                        }
                                    } else if (axis < 0 && axisSetting.neg) {
                                        keystate[axisSetting.neg] = 1;
                                        if (axisSetting.pos) {
                                            keystate[axisSetting.pos] = 0;
                                        }
                                    }
                                } else {
                                    // Axis to Axis
                                    keystate[axisSetting] = axis;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}

//@TODO finish this (Add Mouse Support)