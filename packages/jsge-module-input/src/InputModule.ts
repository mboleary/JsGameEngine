/**
 * Contains the Input Module, replaces the old jmod export
 */

import ModuleBase from "jsge-core/src/ModuleBase";
import { initInput, pollGamepads } from "./Input";
import { InputSubmodule, KeyDef, KeyMapping, ControlType, ControllerConnectParams, Direction, KeyState } from "./types";

export type InputModuleParams = {
    submodules: InputSubmodule[],
    config?: KeyDef[],
}

export class InputModule extends ModuleBase {
    private readonly connectedSubmodules: Map<string, InputSubmodule> = new Map();
    private readonly keyDefs: Map<string, KeyDef> = new Map();
    private readonly keyValues: Map<string, KeyState> = new Map();
    private readonly keyMappings: Map<string, Map<number, Map<any, string[]>>> = new Map();
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

    private setButtonState(keyName: string, pressedKeyState: KeyState, pressedKeyControlType: ControlType) {
        const destKeydef = this.keyDefs.get(keyName);
        if (!destKeydef) {
            throw new Error(`Key ${keyName} does not exist in keyDefs. Internal state is inconsistent!`);
        }

        const keyValue = this.keyValues.get(keyName);
        if (!keyValue) {
            throw new Error(`Key ${keyName} does not exist in keyValues. Internal state is inconsistent!`);
        }

        if (pressedKeyControlType === destKeydef.type) {
            Object.assign(keyValue, pressedKeyState);
        } else if (pressedKeyControlType === ControlType.DIGITAL && destKeydef.type === ControlType.ANALOG) {
            // Digital => Analog; need to account for axis direction

            
        }
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
                    for (const buttonName of buttonMappings) {
                        // this.keyValues.set
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
    private setKeyValue(keyname, rawValue) {

    }
}