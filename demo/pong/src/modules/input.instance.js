import { InputModule, KeyboardSubmodule, ControlType, Direction } from "jsge-module-input";

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
                    controller: 1,
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
                    controller: 1,
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
                    controller: 1,
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
                    controller: 1,
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
                    controller: 1,
                    code: "ArrowRight",
                    name: "ArrowRight"
                }
            ]
        }
    ]
});
