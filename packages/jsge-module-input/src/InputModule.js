/**
 * Contains the Input Module, replaces the old jmod export
 */

import ModuleBase from "jsge-core/src/ModuleBase";
import { initInput, pollGamepads } from "./Input";

export class InputModule extends ModuleBase {
    constructor({ ...options } = {}) {
        super();

        // Metadata
        this._name = "Input";
        this._version = "0.0.0";
        this._debugName = "input";
        this._meta = {};
    }

    init() {
        initInput();
    }

    loop(internals) {
        pollGamepads();
    }

    debug() {
        return {
        };
    }
}