/**
 * This is a Tilemap. This tilemap handles loading the map in and computing how the map will be drawn onto the final render (specific to 2d rendering backend)
 */

// import GameObject from '../../engine/GameObject.js';
// import Script from '../../engine/Script.js';
// import {Renderable} from '../../engine/Render.js';
// import RenderScript from "../../engine/Camera/RenderScript.js";
// import { enrollGameObject } from "../../engine/Engine.js";

import GameObject from 'jsge-core/src/GameObject.js';
import Script from 'jsge-core/src/components/Script.js';

import TileLayer from './TileLayer.js';
import Tile from './Tile.js';

// This behaves like how an ENUM would in other languages
export const MAP_TYPES = Object.freeze({
    ORTHAGONAL: 0,
    // ISOMETRIC: 1,
});

class TileMapScript extends Script {
    constructor() {
        super();
        this.renderType = MAP_TYPES.ORTHAGONAL;
        this.tileset = null; // This should be a Spritesheet
    }

    setTileset(spritesheet) {
        this.tileset = spritesheet;
        // Update the layer spritesheets
        for (const lyr of this.gameObject.children) {
            if (lyr instanceof TileLayer) {
                lyr.tileset = spritesheet;
                // Reset the textures
                for (const c of lyr.children) {
                    if (c instanceof Tile) {
                        if (spritesheet.sheet.has(c.tilesetID)) {
                            c.texture = spritesheet.sheet.get(c.tilesetID);
                        }
                    }
                }
            }
        }
    }

    addLayer(lyr) {
        lyr.renderType = this.renderType;
        lyr.tileset = this.tileset;
        console.log("Adding Layer:", lyr)
        this.gameObject.attachGameObject(lyr);
    }
}

class TileMap extends GameObject {
    constructor() {
        super();
        this.attachScript(new TileMapScript());
    }
}


export default TileMap;