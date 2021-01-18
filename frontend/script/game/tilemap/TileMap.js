/**
 * This is a Tilemap. This tilemap handles loading the map in and computing how the map will be drawn onto the final render (specific to 2d rendering backend)
 */

import  GameObject  from '../../engine/GameObject.js';
import  Script  from '../../engine/Script.js';

// This behaves like how an ENUM would in other languages
export const MAP_TYPES = Object.freeze({
    ORTHAGONAL: 0,
    // ISOMETRIC: 1,
});

export default class TileMap extends GameObject {
    constructor() {
        super();
        this.layers = [];
        this.renderType = MAP_TYPES.ORTHAGONAL;
        this.tileset = null; // This should be a Spritesheet
    }

    setTileset(spritesheet) {
        this.tilesset = spritesheet;
    }


}

class PreRenderScript extends Script {

}