/**
 * Contains multiple tiles in a unit that makes it easier to load into a game
 */

// import GameObject from '../../engine/GameObject.js';
// import {Renderable} from '../../engine/Render.js';
// import RenderScript from "../../engine/Camera/RenderScript.js";

import GameObject from 'jsge-core/src/GameObject.js';
import {Renderable} from 'jsge-module-graphics2d/src/Render.js';
import RenderScript from "jsge-module-graphics2d/src/Camera/RenderScript.js";

import {MAP_TYPES} from './TileMap.js';
class PreRenderScript extends RenderScript {
    constructor() {
        super();
        let canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
        this.renderType = MAP_TYPES.ORTHAGONAL;
        this.tileset = null; // This should be a Spritesheet
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
class TileChunk extends Renderable(GameObject) {
    constructor() {
        super();
        this.attachScript(new PreRenderScript());
    }

    setTileset(spritesheet) {
        this.tileset = spritesheet;
    }
}