/**
 * Contains the Input Module, replaces the old jmod export
 */

import {ModuleBase, EngineInternals} from "jsge-core";
// import { pollGamepads } from "./Input";
import { InputSubmodule, KeyDef, KeyMapping, ControlType, ControllerConnectParams, Direction, KeyState } from "./types";
import { clamp } from "./util";
import { InvalidKeyNameError } from "./errors";

export type InputModuleParams = {
    submodules: InputSubmodule[],
    config: KeyDef[],
}

type ButtonMapping = {
    name: string;
    modifier: number;
}

// Threshold of pushing a button if it's bound to an axis
const A2D_THRESHOLD = 0.5;

export const INPUT_MODULE_ID = "input";

export class InputModule extends ModuleBase {
    readonly _name = "Input";
    readonly _version = "0.0.0";
    readonly _debugName = "input";
    readonly _id = INPUT_MODULE_ID;
    readonly _meta = {};
    readonly hasInit = true;


    // All connected submodules
    private readonly connectedSubmodules: Map<string, InputSubmodule> = new Map();
    // All Key Definitions
    private readonly keyDefs: Map<string, KeyDef> = new Map();
    // All current Key States
    private readonly keyValues: Map<string, KeyState> = new Map();
    // Contains all mappings of keys by submodule to which buttons they are mapped to (submodule.controller.name => ButtonMapping[])
    private readonly keyMappings: Map<string, Map<number, Map<string, ButtonMapping[]>>> = new Map();

    // For binding keys on next input
    private setKeyOnNextInputActive: boolean = false;
    private setKeyOnNextInputResolve: Function | null = null;
    private setKeyOnNextInputReject: Function | null = null;
    private setKeyOnNextInputName: string | null = null;
    private setKeyOnNextInputReplace: boolean | null = null;

    // Keep track of whether the module has been initialized for adding submodules afterwards
    private initialized = false;
    private submodulesToPoll: InputSubmodule[] = [];
    
    constructor({ submodules, config, ...options } :InputModuleParams = {submodules:[], config: []}) {
        super();

        // Setup Submodules
        for (const submod of submodules) {
            this.connectSubmodule(submod);
        }

        // Setup Config
        for (const {mappings, ...keyDef} of config) {
            this.keyDefs.set(keyDef.name, {...keyDef, mappings: []});
            for (const mapping of mappings) {
                this.bindKey(keyDef.name, mapping);
            }
            this.keyValues.set(keyDef.name, {
                rawValue: 0,
                maxValue: 0,
                minValue: 0,
                value: 0
            });
        }
    }

    public init() {
        this.initialized = true;

        for (const submod of this.connectedSubmodules.values()) {
            submod.init();
        }
    }

    public loop(internals: EngineInternals) {
        for (const submod of this.submodulesToPoll) {
            submod.poll();
        }
    }

    public debug() {
        return {
            setKeyValue: this.setKeyValue,
            defineKey: this.defineKey,
            bindKey: this.bindKey,
        };
    }

    /**
     * Adds an input submodule to the Input Module
     * @param submodule 
     */
    public connectSubmodule(submodule: InputSubmodule) {
        if (!this.connectedSubmodules.has(submodule.name)) {
            console.log("connecting submodule:", submodule);
            submodule.connect({
                inputCallback: this.inputHandler.bind(this),
                controllerConnectCallback: this.controllerConnectHandler,
                controllerDisconnectCallback: this.controllerDisconnectHandler,
            });
            this.connectedSubmodules.set(submodule.name, submodule);

            // Ensure that submodule is initialized if added after that happens
            if (this.initialized) {
                submodule.init();
            }

            if (submodule.needsPolling) {
                this.submodulesToPoll.push(submodule);
            }
        }
    }

    /**
     * Returns the state of the key
     * @param name 
     */
    public getKey(name: string): KeyState {
        const toRet = this.keyValues.get(name);

        if (toRet) {
            return toRet;
        }

        throw new InvalidKeyNameError(`'${name}' is not a valid key!`);

    }

    /**
     * Binds a key on the next input
     * @param name key name
     * @param replace true if all other bindings for that key should be replaced
     * @returns Promise which will resolve on the next binding
     */
    public bindKeyOnNextInput(name: string, replace: boolean = false): Promise<KeyMapping<any>> {
        if (this.setKeyOnNextInputActive) {
            this.setKeyOnNextInputActive = false;
            if (this.setKeyOnNextInputReject !== null) {
                this.setKeyOnNextInputReject();
            }
        }
        return new Promise<KeyMapping<any>>((resolve, reject) => {
            this.setKeyOnNextInputActive = true;
            this.setKeyOnNextInputResolve = resolve;
            this.setKeyOnNextInputReject = reject;
            this.setKeyOnNextInputName = name;
            this.setKeyOnNextInputReplace = replace;
        });
    }

    /**
     * Cancel binding a key on next input
     */
    public cancelBindKeyOnNextInput() {
        if (this.setKeyOnNextInputActive && this.setKeyOnNextInputReject !== null) {
            this.setKeyOnNextInputReject();
        }
    }

    /**
     * Returns the current Key Config
     * @returns KeyDef array
     */
    public getKeyConfig(): KeyDef[] {
        return Array.from(this.keyDefs.values());
    }

    /**
     * Replaces all existing keybindings with new ones
     * @param config 
     */
    public setKeyBindings(config: Pick<KeyDef, "name" | "mappings">[]) {
        for (const {name, mappings} of config) {
            if (this.keyDefs.has(name)) {
                this.unbindKey(name);
                for (const mapping of mappings) {
                    this.bindKey(name, mapping);
                }
            }
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

    /**
     * Binds a key to an input
     * @param name 
     * @param mapping 
     * @param replace 
     * @returns 
     */
    public bindKey(name: string, mapping: KeyMapping<any>, replace: boolean = false) {
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

    /**
     * Removes all bindings from a key
     * @param name 
     */
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

            // Update KeyDefs
            keyDef.mappings = [];
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

        console.log(keyValue);
    }

    /**
     * Handles inputs from all submodules, and maps them to the keybindings
     * @param params 
     * @param keyState 
     * @param controlType 
     */
    private inputHandler(params: KeyMapping<any>, keyState: KeyState): void {
        console.log("handling input:", params, keyState);
        if (this.setKeyOnNextInputActive && this.setKeyOnNextInputName !== null && this.setKeyOnNextInputReplace !== null && this.setKeyOnNextInputResolve !== null) {
            // Set the key binding
            this.bindKey(this.setKeyOnNextInputName, params, this.setKeyOnNextInputReplace);
            this.setKeyOnNextInputResolve({...params});
            this.setKeyOnNextInputActive = false;
            this.setKeyOnNextInputName = null;
            this.setKeyOnNextInputReplace = null;
        }
        const submodDefMap = this.keyMappings.get(params.submodule);
        console.log({submodDefMap});
        if (submodDefMap) {
            const controllerDefMap = submodDefMap.get(params.controller);
            if (controllerDefMap) {
                const buttonMappings = controllerDefMap.get(params.name);
                if (buttonMappings) {
                    for (const {name, modifier} of buttonMappings) {
                        this.setButtonState(name, keyState, modifier);
                    }
                } else {
                    console.warn(`Input Module: button ${params.name} not mapped for controller ${params.controller} in submodule ${params.submodule}`);
                }
            } else {
                console.warn(`Input Module: controller ${params.controller} not bound in submodule ${params.submodule}`);
            }
        } else {
            console.warn(`Input Module: Submodule ${params.submodule} not bound in keyMappings`);
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