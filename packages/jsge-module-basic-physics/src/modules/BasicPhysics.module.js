import { ModuleBase } from "jsge-core/src";

export class BasicPhysicsModule extends ModuleBase {
    constructor({...options} = {}) {
        super();

        this._name = "BasicPhysics";
        this._version = "0.0.0";
        this._debugName = "physics";
        this._meta = {};
    }

    init() {

    }

    loop() {

    }

    debug() {
        return {};
    }
}