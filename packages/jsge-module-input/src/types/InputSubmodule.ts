import { InputCallbackFunction } from "./CallbackFunctions";

export type InputSubmoduleConnectParams = {
    inputCallback: InputCallbackFunction;
    controllerConnectCallback: Function;
    controllerDisconnectCallback: Function;
};

function noop() {};

export abstract class InputSubmodule {
    protected inputCallback: InputCallbackFunction = noop;
    protected controllerConnectedCallback: Function = noop;
    protected controllerDisconnectCallback: Function = noop;
    protected callbacksAssigned: boolean = false;
    abstract readonly name: string;
    abstract readonly needsPolling: boolean;
    abstract init(): void;
    abstract poll(): void;
    public connect(params: InputSubmoduleConnectParams): void {
        this.inputCallback = params.inputCallback;
        this.controllerConnectedCallback = params.controllerConnectCallback;
        this.controllerDisconnectCallback = params.controllerDisconnectCallback;
        this.callbacksAssigned = true;
    }
    abstract destroy(): void;

}