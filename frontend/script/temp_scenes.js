/**
 * This is a collection of the scenes that are being used in JSGE. This file should be removed after Asset Loading / Prefabs are working properly.
 */

import Scene from './engine/Scene.js';

import Test from './game/Test.js';

import ControllerTest2 from './game/ControllerTest2.js';

import { Camera } from './engine/Camera/Camera.js';
import DrawsThings from './game/DrawsThings.js';

import TileMap from "./game/tilemap/TileMap.js";
import TileLayer from './game/tilemap/TileLayer.js';

import { asset } from './engine/Asset/AssetLoader.js';

/**
 * Constructs the Space Scene that has the starfield and FighterPilot Ship
 */

export function spaceScene() {
    let scene = new Scene();
    scene.name = "Space Scene";
    scene.attachGameObject(new DrawsThings());
    scene.attachGameObject(new Test());
    scene.attachGameObject(new ControllerTest2());
    scene.attachGameObject(new Camera());
    return scene;
}

export function tileScene() {
    let scene = new Scene();
    scene.name = "Tile Scene";
    scene.attachGameObject(new Camera());

    let tm = new TileMap();
    
    scene.attachGameObject(tm);
    
    let lyr = new TileLayer();
    lyr.transform.scale.x = 4;
    lyr.transform.scale.y = 4;
    let arr = [
        [0,1,2],
        [3,4,5]
    ];
    lyr.scripts[0].importFromArr(arr, 16);
    tm.scripts[0].addLayer(lyr);

    const f = async () => {
        let scr = tm.scripts[0]; // Should be TileMapScript
        let t = await asset("tilesheet");
        scr.setTileset(t);

        
    }
    f();
    return scene;
}