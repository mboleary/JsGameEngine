import { InputSubmodule } from "../types/InputSubmodule";
import { ControlType } from "../types/ControlType.enum";

export class KeyboardSubmodule extends InputSubmodule {
    readonly needsPolling = false;
    readonly controllerNumber = 0;
    readonly name = "keyboard";
    constructor() {
        super();
    }

    private handleKeydown(event:KeyboardEvent) {
        if (this.callbacksAssigned) {
            this.inputCallback({
                controller: this.controllerNumber,
                submodule: this.name,
                code: event.key,
                name: event.key
            }, 1, ControlType.DIGITAL);
        }
    }

    private handleKeyup(event: KeyboardEvent) {
        if (this.callbacksAssigned) {
            this.inputCallback({
                controller: this.controllerNumber,
                submodule: this.name,
                code: event.keyCode,
                name: event.key
            }, 0, ControlType.DIGITAL);
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