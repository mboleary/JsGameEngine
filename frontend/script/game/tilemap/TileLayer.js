/**
 * Contains the Tile Layer, which comes in a few variants; One to hold Tiles, and the other to hold Objects
 */

import GameObject from "../../engine/GameObject.js";
import Script from "../../engine/Script.js";
import Tile from "./Tile.js";

class TileImportScript extends Script {
    constructor() {
        super();
    }

    // Arr of ints
    importFromArr(arr, size) {
        for (let i = 0; i < arr.length; i++) {
            const r = arr[i];
            for (let j = 0; j < r.length; j++) {
                const c = r[j];
                const t = new Tile();
                t.tilesetID = c;
                t.transform.position.x = j * size;
                t.transform.position.y = i * size;
                if (this.gameObject.tileset && this.gameObject.tileset.sheet.has(c)) {
                    t.texture = this.gameObject.tileset.sheet.get(c);
                }
                this.gameObject.attachGameObject(t);
            }
        }
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