/**
 * Contains the Tile Layer, which comes in a few variants; One to hold Tiles, and the other to hold Objects
 */

// import GameObject from "../../engine/GameObject.js";
// import Script from "../../engine/Script.js";

import GameObject from "/node_modules/jsge-core/src/GameObject.js";
import Script from "/node_modules/jsge-core/src/Script.js";

import Tile from "./Tile.js";

class TileImportScript extends Script {
    constructor() {
        super();
        this.tiles = [];
    }

    // Arr of ints
    importFromArr(arr, size) {
        for (let i = 0; i < arr.length; i++) {
            const r = arr[i];
            let rowArr = [];
            for (let j = 0; j < r.length; j++) {
                const c = r[j];
                const t = new Tile();
                t.tilesetID = c;
                t.row = i;
                t.column = j;
                t.transform.position.x = j * size;
                t.transform.position.y = i * size;
                if (this.gameObject.tileset && this.gameObject.tileset.sheet.has(c)) {
                    t.texture = this.gameObject.tileset.sheet.get(c);
                }
                this.gameObject.attachGameObject(t);
                rowArr.push(t);
            }
            this.tiles.push(rowArr);
        }
    }

    setTile(r, c, id) {
        const t = this.tiles[r][c];
        t.tilesetID = id;
        if (this.gameObject.tileset && this.gameObject.tileset.sheet.has(id)) {
            t.texture = this.gameObject.tileset.sheet.get(id);
        }
    }

    getTile(r, c) {
        return this.tiles[r][c];
    }
}

class TileLayer extends GameObject {
    constructor() {
        super();
        this.renderType = null;
        this.tileset = null;
        this.attachScript(new TileImportScript());
    }
}

export default TileLayer