/**
 * Contains the Rendering Module, replaces the old jmod export
 */

import {ModuleBase} from "jsge-core";
import {initializeWith2dContext, renderGameObjectsWith2dContext} from "../Render";

export class RenderModule extends ModuleBase {
    constructor({...options} = {}) {
        super();

        // Metadata
        this._name = "Graphics2d";
        this._version = "0.0.0";
        this._debugName = "graphics2d";
        this._id = "graphics2d";
        this._meta = {};

        // Implementation
        this.canvas = null;
        this.context = null;
    }

    init() {
        initializeWith2dContext();
    }

    loop(internals) {
        renderGameObjectsWith2dContext(internals.gameObjects);
    }

    debug() {
        return {
        };
    }
}