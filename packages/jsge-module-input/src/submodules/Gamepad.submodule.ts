import { InputSubmodule } from "../types/InputSubmodule";
import { ControlType } from "../types/ControlType.enum";
import { KeyState } from "../types";

export class GamepadSubmodule extends InputSubmodule {
    readonly needsPolling = true;
    readonly controllerNumber = 0;
    readonly name = "keyboard";
    private readonly gamepads: Map<number, Gamepad> = new Map();
    constructor() {
        super();
    }

    private handleGamepadConnected(event: GamepadEvent) {
        this.gamepads.set(event.gamepad.index, event.gamepad);

    }

    private handleGamepadDisconnected(event: GamepadEvent) {
        this.gamepads.delete(event.gamepad.index);
    }

    // private handleKeydown(event:KeyboardEvent) {
    //     if (this.callbacksAssigned) {
    //         const keyState: KeyState = {
    //             rawValue: 1,
    //             minValue: 0,
    //             maxValue: 1,
    //             value: 1
    //         };
    //         this.inputCallback({
    //             controller: this.controllerNumber,
    //             submodule: this.name,
    //             code: event.key,
    //             name: event.key
    //         }, keyState, ControlType.DIGITAL);
    //     }
    // }

    // private handleKeyup(event: KeyboardEvent) {
    //     if (this.callbacksAssigned) {
    //         const keyState: KeyState = {
    //             rawValue: 0,
    //             minValue: 0,
    //             maxValue: 1,
    //             value: 0
    //         };
    //         this.inputCallback({
    //             controller: this.controllerNumber,
    //             submodule: this.name,
    //             code: event.keyCode,
    //             name: event.key
    //         }, keyState, ControlType.DIGITAL);
    //     }
    // }

    public init() {
        // window.addEventListener('keydown', this.handleKeydown);
        // window.addEventListener('keyup', this.handleKeyup);
    }

    public poll() {
        if (this.gamepads.size === 0 || !this.callbacksAssigned) return;

        for (const gamepad of this.gamepads.values()) {

        }
    }

    public destroy() {
        // window.removeEventListener('keydown', this.handleKeydown);
        // window.removeEventListener('keyup', this.handleKeyup);
    }
}