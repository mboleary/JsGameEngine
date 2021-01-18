/**
 * This is a collection of the scenes that are being used in JSGE. This file should be removed after Asset Loading / Prefabs are working properly.
 */

import Scene from './engine/Scene.js';

import Test from './game/Test.js';

import ControllerTest2 from './game/ControllerTest2.js';

import { Camera } from './engine/Camera/Camera.js';
import DrawsThings from './game/DrawsThings.js';

import TileMap from "./game/tilemap/TileMap.js";

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
    let tm = new TileMap();
    scene.attachGameObject(tm);
    return scene;
}