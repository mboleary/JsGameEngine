import { InputModule, KeyboardSubmodule, ControlType, Direction, KEYBOARD_CONTROLLER_NUMBER } from "jsge-module-input";

const keyboardSubmoduleInstance = new KeyboardSubmodule();

export const inputModuleInstance = new InputModule({
    submodules: [
        keyboardSubmoduleInstance
    ],
    config: [
        {
            name: "test",
            type: ControlType.DIGITAL,
            direction: Direction.OUT,
            mappings: [
                {
                    submodule: keyboardSubmoduleInstance.name,
                    controller: KEYBOARD_CONTROLLER_NUMBER,
                    code: " ",
                    name: " "
                }
            ]
        },
        {
            name: "up",
            type: ControlType.DIGITAL,
            direction: Direction.OUT,
            mappings: [
                {
                    submodule: keyboardSubmoduleInstance.name,
                    controller: KEYBOARD_CONTROLLER_NUMBER,
                    code: "ArrowUp",
                    name: "ArrowUp"
                }
            ]
        },
        {
            name: "down",
            type: ControlType.DIGITAL,
            direction: Direction.OUT,
            mappings: [
                {
                    submodule: keyboardSubmoduleInstance.name,
                    controller: KEYBOARD_CONTROLLER_NUMBER,
                    code: "ArrowDown",
                    name: "ArrowDown"
                }
            ]
        },
        {
            name: "left",
            type: ControlType.DIGITAL,
            direction: Direction.OUT,
            mappings: [
                {
                    submodule: keyboardSubmoduleInstance.name,
                    controller: KEYBOARD_CONTROLLER_NUMBER,
                    code: "ArrowLeft",
                    name: "ArrowLeft"
                }
            ]
        },
        {
            name: "right",
            type: ControlType.DIGITAL,
            direction: Direction.OUT,
            mappings: [
                {
                    submodule: keyboardSubmoduleInstance.name,
                    controller: KEYBOARD_CONTROLLER_NUMBER,
                    code: "ArrowRight",
                    name: "ArrowRight"
                }
            ]
        }
    ]
});
