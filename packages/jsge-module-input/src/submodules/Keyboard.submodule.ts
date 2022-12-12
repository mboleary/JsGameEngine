import { InputSubmodule } from "../types/InputSubmodule";
import { ControlType } from "../types/ControlType.enum";
import { KeyState } from "../types";

const CONTROLLER_NUMBER = 0;

export class KeyboardSubmodule extends InputSubmodule {
    readonly needsPolling = false;
    readonly name = "keyboard";
    constructor() {
        super();
    }

    private handleKeydown(event:KeyboardEvent) {
        if (this.callbacksAssigned) {
            const keyState: KeyState = {
                rawValue: 1,
                minValue: 0,
                maxValue: 1,
                value: 1
            };
            this.inputCallback({
                controller: CONTROLLER_NUMBER,
                submodule: this.name,
                code: event.key,
                name: event.key
            }, keyState, ControlType.DIGITAL);
        }
    }

    private handleKeyup(event: KeyboardEvent) {
        if (this.callbacksAssigned) {
            const keyState: KeyState = {
                rawValue: 0,
                minValue: 0,
                maxValue: 1,
                value: 0
            };
            this.inputCallback({
                controller: CONTROLLER_NUMBER,
                submodule: this.name,
                code: event.key,
                name: event.key
            }, keyState, ControlType.DIGITAL);
        }
    }

    public init() {
        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keyup', this.handleKeyup);
    }

    public poll() {

    }

    public destroy() {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('keyup', this.handleKeyup);
    }
}