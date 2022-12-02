/**
 * Contains the Input Module, replaces the old jmod export
 */

import ModuleBase from "jsge-core/src/ModuleBase";
import { initInput, pollGamepads } from "./Input";
import { InputSubmodule, KeyDef, KeyMapping, ControlType, ControllerConnectParams, Direction, KeyState } from "./types";
import { clamp } from "./util";

export type InputModuleParams = {
    submodules: InputSubmodule[],
    config?: KeyDef[],
}

type ButtonMapping = {
    name: string;
    modifier: number;
}

// Threshold of pushing a button if it's bound to an axis
const A2D_THRESHOLD = 0.5;

export class InputModule extends ModuleBase {
    // All connected submodules
    private readonly connectedSubmodules: Map<string, InputSubmodule> = new Map();
    // All Key Definitions
    private readonly keyDefs: Map<string, KeyDef> = new Map();
    // All current Key States
    private readonly keyValues: Map<string, KeyState> = new Map();
    // Contains all mappings of keys by submodule to which buttons they are mapped to (submodule.controller.name => ButtonMapping[])
    private readonly keyMappings: Map<string, Map<number, Map<string, ButtonMapping[]>>> = new Map();
    constructor({ submodules, config, ...options } :InputModuleParams = {submodules:[]}) {
        super(options);

        // Metadata
        this._name = "Input";
        this._version = "0.0.0";
        this._debugName = "input";
        this._meta = {};

        // Setup Submodules
        for (const submod of submodules) {
            this.connectSubmodule(submod);
        }

        // Setup Config

    }

    public init() {
        initInput();
    }

    public loop(internals) {
        pollGamepads();
    }

    public debug() {
        return {
            setKeyValue: this.setKeyValue,
            defineKey: this.defineKey,
        };
    }

    /**
     * Adds an input submodule to the Input Module
     * @param submodule 
     */
    public connectSubmodule(submodule: InputSubmodule) {
        if (!this.connectedSubmodules.has(submodule.name)) {
            submodule.connect({
                inputCallback: this.inputHandler,
                controllerConnectCallback: this.controllerConnectHandler,
                controllerDisconnectCallback: this.controllerDisconnectHandler,
            });
        }
    }

    /**
     * Defines a key in the keymap
     * @param name 
     * @param type 
     * @param direction 
     */
    private defineKey(name: string, type: ControlType, direction:Direction = Direction.IN): void {
        const toSave: KeyDef = {
            name,
            type,
            direction,
            mappings: []
        };

        this.keyDefs.set(name, toSave);
    }

    private bindKey(name: string, mapping: KeyMapping<any>, replace: boolean = false) {
        const keyDef = this.keyDefs.get(name);

        if (keyDef) {

            // Check if mapping is already present

            for (const kdMapping of keyDef.mappings) {
                if (mapping.submodule === kdMapping.submodule && mapping.controller === kdMapping.controller && mapping.name === kdMapping.name) {
                    return;
                }
            }

            if (replace) {
                this.unbindKey(name);
            }

            keyDef.mappings.push({
                ...mapping,
            });
            
            // Add the new binding to the key mappings table

            let submodDefMap, controllerDefMap, buttonMappings: ButtonMapping[];

            if (this.keyMappings.has(mapping.submodule)) {
                submodDefMap = this.keyMappings.get(mapping.submodule);
            } else {
                submodDefMap = new Map();
                this.keyMappings.set(mapping.submodule, submodDefMap);
            }

            if (submodDefMap) {
                if (submodDefMap.has(mapping.controller)) {
                    controllerDefMap = submodDefMap.get(mapping.controller);
                } else {
                    controllerDefMap = new Map();
                    submodDefMap.set(mapping.controller, controllerDefMap);
                }

                if (controllerDefMap) {
                    if (controllerDefMap.has(mapping.controller)) {
                        buttonMappings = controllerDefMap.get(mapping.controller);
                    } else {
                        buttonMappings = [];
                        controllerDefMap.set(mapping.controller, buttonMappings);
                    }

                    buttonMappings.push({
                        name,
                        modifier: mapping.modifier || 1,
                    });
                }
            }
        }
    }

    private unbindKey(name: string) {
        const keyDef = this.keyDefs.get(name);

        // Update the key mappings table
        if (keyDef) {   
            for (const mapping of keyDef.mappings) {
                const submodDefMap = this.keyMappings.get(mapping.submodule);
                if (submodDefMap) {
                    const controllerDefMap = submodDefMap.get(mapping.controller);
                    if (controllerDefMap && controllerDefMap.has(mapping.name)) {
                        controllerDefMap.delete(mapping.name);

                        if (controllerDefMap.size === 0) {
                            submodDefMap.delete(mapping.controller);
                        }
                    }

                    if (this.keyMappings.size === 0) {
                        this.keyMappings.delete(mapping.submodule);
                    }
                }
            }
        }
    }

    private setButtonState(keyName: string, pressedKeyState: KeyState, modifier: number) {
        const destKeydef = this.keyDefs.get(keyName);
        if (!destKeydef) {
            throw new Error(`Key ${keyName} does not exist in keyDefs. Internal state is inconsistent!`);
        }

        const keyValue = this.keyValues.get(keyName);
        if (!keyValue) {
            throw new Error(`Key ${keyName} does not exist in keyValues. Internal state is inconsistent!`);
        }

        let value = 0;

        if (keyValue.minValue === 0 && keyValue.maxValue === 1 && keyValue.rawValue >= 0 && keyValue.rawValue <= 1) {
            value = keyValue.rawValue * modifier;
        } else if (keyValue.minValue === -1 && keyValue.maxValue === 1 && keyValue.rawValue >= -1 && keyValue.rawValue <= 1) {
            value = keyValue.rawValue * modifier;
        } else {
            value = ((keyValue.rawValue - keyValue.minValue) / (keyValue.maxValue - keyValue.minValue)) * modifier;
        }

        if (destKeydef.type === ControlType.DIGITAL) {
            value = value > A2D_THRESHOLD ? 1 : 0;
        } else {
            value = clamp(value, -1, 1);
        }

        keyValue.value = value;
        keyValue.minValue = pressedKeyState.minValue;
        keyValue.maxValue = pressedKeyState.maxValue;
        keyValue.rawValue = pressedKeyState.rawValue;
    }

    /**
     * Handles inputs from all submodules, and maps them to the keybindings
     * @param params 
     * @param keyState 
     * @param controlType 
     */
    private inputHandler(params: KeyMapping<any>, keyState: KeyState, controlType: ControlType): void {
        const submodDefMap = this.keyMappings.get(params.submodule);
        if (submodDefMap) {
            const controllerDefMap = submodDefMap.get(params.controller);
            if (controllerDefMap) {
                const buttonMappings = controllerDefMap.get(params.name);
                if (buttonMappings) {
                    for (const {name, modifier} of buttonMappings) {
                        this.setButtonState(name, keyState, modifier);
                    }
                }
            }
        }
    }

    /**
     * Handles controllers being connected
     * @param params 
     */
    private controllerConnectHandler(params: ControllerConnectParams): void {

    }

    /**
     * Handles controller being disconnected
     * @param params 
     */
    private controllerDisconnectHandler(params: ControllerConnectParams): void {

    }

    /**
     * Manually sets a key to a given value
     * @param keyname 
     * @param rawValue 
     */
    private setKeyValue(keyname: string, rawValue: Partial<KeyState>) {

    }
}