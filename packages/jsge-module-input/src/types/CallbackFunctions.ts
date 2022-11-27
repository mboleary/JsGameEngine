import { KeyMapping } from "./KeyMapping";
import { ControlType } from "./ControlType.enum";
import { KeyState } from "./KeyState";

export type InputCallbackFunction = (params: KeyMapping<any>, keyState: KeyState, controlType: ControlType) => void;

export type ControllerConnectParams = {
    controller: number,
    submodule: string,
}

export type ControllerConnectFunction = (params: ControllerConnectParams) => void;
export type ControllerDisconnectFunction = (params: ControllerConnectParams) => void;