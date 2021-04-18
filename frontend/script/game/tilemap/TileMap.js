/**
 * This is a Tilemap. This tilemap handles loading the map in and computing how the map will be drawn onto the final render (specific to 2d rendering backend)
 */

import GameObject from '../../engine/GameObject.js';
// import Script from '../../engine/Script.js';
import {Renderable} from '../../engine/Render.js';
import RenderScript from "../../engine/Camera/RenderScript.js";

// This behaves like how an ENUM would in other languages
export const MAP_TYPES = Object.freeze({
    ORTHAGONAL: 0,
    // ISOMETRIC: 1,
});

class PreRenderScript extends RenderScript {
    constructor() {
        super();
        let canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
    }

    init() {
        if (!this.gameObject.tileset) return;
        // Render the entire map
    }

    loop() {
        if (!this.gameObject.tileset) return;
    }

    render(ctx, width, height) {
        // Get the Transform from the 2D context to determine where the camera is

    }
}
class TileMap extends Renderable(GameObject) {
    constructor() {
        super();
        this.layers = [];
        this.renderType = MAP_TYPES.ORTHAGONAL;
        this.tileset = null; // This should be a Spritesheet
        this.attachScript(new PreRenderScript());
    }

    setTileset(spritesheet) {
        this.tileset = spritesheet;
    }

    addLayer(lyr) {
        this.layers.push(lyr);
    }
}


export default TileMap;