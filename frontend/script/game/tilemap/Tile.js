/**
 * Tile Encapsulation Class
 */

import GameObject from '../../engine/GameObject.js';
import Script from '../../engine/Script.js';

// A Tile is embedded into a TileChunk
export default class Tile extends GameObject {
    constructor() {
        super();
        this.tilesetID = -1;
    }
}