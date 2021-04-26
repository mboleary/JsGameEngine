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

import BoxMovementBehavior from "./game/BoxMovement.js";

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

/**
 * Generates the Tile Map Demo scene
 * @returns the Tilemap demo scene
 */

export function tileScene() {
    let scene = new Scene();
    scene.name = "Tile Scene";

    let cam = new Camera();
    let bmb = new BoxMovementBehavior();
    cam.attachScript(bmb);
    scene.attachGameObject(cam);

    let tm = new TileMap();
    
    scene.attachGameObject(tm);
    
    let lyr = new TileLayer();
    lyr.transform.scale.x = 4;
    lyr.transform.scale.y = 4;
    // let arr = [
    //     [0,1,2],
    //     [3,4,5]
    // ];
    let arr = genTileArr();
    console.log(arr);
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

const DEFAULT_SIZE = 100;
const DEFAULT_TILE_VALUES = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
    21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,
];

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function genTileArr(xSize = DEFAULT_SIZE, ySize = DEFAULT_SIZE, tileValues = DEFAULT_TILE_VALUES) {
    let toRet = [];
    for (let y = 0; y < ySize; y++) {
        let arr = [];
        for (let x = 0; x < xSize; x++) {
            let v = randInt(0, tileValues.length);
            arr.push(tileValues[v]);
        }
        toRet.push(arr);
    }
    return toRet;
}