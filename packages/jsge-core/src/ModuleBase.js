/**
 * Contains the module base class, also adds a pre-init step for adding custom loaders to the asset loader.
 */

export default class ModuleBase {
    constructor() {
        this._name = "Module";
        this._debugName = null;
        this._version = "0.0.0";
        this._meta = {};
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
    loop(internals) {}

    /**
     * Override this method to do something when the game is being stopped
     */
    onClose() {}

    onDebugEvent() {}
}
