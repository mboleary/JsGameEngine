/**
 * Contains the module base class, also adds a pre-init step for adding custom loaders to the asset loader.
 */

import { EngineInternals } from "./types";

export class ModuleBase {
    readonly _name: string;
    readonly _id: string;
    readonly _debugName: string | null;
    readonly _version: string;
    readonly _meta: object;
    readonly hasInit: boolean;
    readonly hasLoop: boolean;

    constructor() {
        this._name = "Module";
        this._id = "module";
        this._debugName = null;
        this._version = "0.0.0";
        this._meta = {};
        this.hasInit = false;
        this.hasLoop = false;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get debugName() {
        return this._debugName;
    }

    get version() {
        return this._version;
    }

    get meta() {
        return this._meta;
    }

    /**
     * Override this method to initialize the module
     */
    init() {}

    /**
     * Override this method to build a debug object
     */
    debug() {
        return {};
    }

    /**
     * Override this method to gain access to the main loop
     * @param {*} internals 
     */
    loop(internals: EngineInternals) {}

    /**
     * Override this method to do something when the game is being stopped
     */
    onClose() {}

    onDebugEvent() {}
}
