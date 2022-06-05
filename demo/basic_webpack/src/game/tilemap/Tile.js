/**
 * Tile Encapsulation Class
 */

// import GameObject from '../../engine/GameObject.js';
import GameObject from 'jsge-core/src/GameObject.js';

// A Tile is embedded into a TileChunk
export default class Tile extends GameObject {
    constructor() {
        super();
        this.tilesetID = -1;
        this.row = -1;
        this.column = -1;
    }
}