/**
 * This is a collection of the scenes that are being used in JSGE. This file should be removed after Asset Loading / Prefabs are working properly.
 */

// import Scene from './engine/Scene.js';
// import { Camera } from './engine/Camera/Camera.js';
// import { asset } from './engine/Asset/AssetLoader.js';

import Scene from 'jsge-core/src/Scene.js';
// import { asset } from 'asset-loader/src/AssetLoader.js';

import testFactory from './game/Test.js';
import drawsThingsFactory from './game/DrawsThings.js';
import controllerTest2Factory from './game/ControllerTest2.js';
import GameObject from 'jsge-core/src/GameObject';
import CameraViewportComponent from "jsge-module-graphics2d/src/components/CameraViewport.component";
import TransformComponent from 'jsge-module-graphics2d/src/components/Transform.component';
import {buildGameObjectFromPrefab} from "jsge-core/src/prefab";
// import TileMap from "./game/tilemap/TileMap.js";
// import TileLayer from './game/tilemap/TileLayer.js';
// import BoxMovementBehavior from "./game/BoxMovement.js";

const TestPrefab = {
    "name": "Test Prefab",
    "scene": false,
    "modules": [],
    "meta": {
        "test": true
    },
    "assets": [
        {
            "name": "PLAYER",
            "path": "/asset/fp/Player.png",
            "type": "image"
        }
    ],
    "root": {
        "name": "Test Pilot from Prefab",
        "id": "4ed2040c-264b-11ed-8405-cb2de71853f0",
        "group": "test",
        "children": [],
        "components": [
            {
                "type": "TransformComponent",
                "data": {
                    "value": {
                        "scale": {
                            "x": 2,
                            "y": 2
                        }
                    }
                }
            },
            {
                "type": "ControllerTest2Behavior"
            },
            {
                "type": "SpriteComponent",
                "data": {
                    "assetName": "PLAYER"
                }
            }
        ]
    }
};

/**
 * Constructs the Space Scene that has the starfield and FighterPilot Ship
 */

export function spaceScene() {
    let scene = new Scene();
    scene.name = "Space Scene";
    scene.attachGameObject(drawsThingsFactory());
    scene.attachGameObject(testFactory());
    // scene.attachGameObject(controllerTest2Factory());
    const ct2 = buildGameObjectFromPrefab(TestPrefab, {ignoreErrors: false});
    console.log("ControllerTest2", ct2);
    scene.attachGameObject(ct2);
    scene.attachGameObject(cameraFactory());
    return scene;
}

function cameraFactory() {
    let toRet = new GameObject({
        name: "Camera"
    });

    let cc = new CameraViewportComponent();
    let tr = new TransformComponent();

    toRet.attachComponent(cc);
    toRet.attachComponent(tr);

    return toRet;
}

/**
 * Generates the Tile Map Demo scene
 * @returns the Tilemap demo scene
 */

// export function tileScene() {
//     let scene = new Scene();
//     scene.name = "Tile Scene";

//     let cam = new Camera();
//     let bmb = new BoxMovementBehavior();
//     bmb.xChange = 10;
//     bmb.yChange = 10;
//     bmb.speed = 0.01;
//     // cam.attachScript(bmb);
//     scene.attachGameObject(cam);

//     let tm = new TileMap();
//     // tm.transform.rotation.x = 45;
//     scene.attachGameObject(tm);
    
//     let lyr = new TileLayer();
//     lyr.transform.scale.x = 4;
//     lyr.transform.scale.y = 4;
//     // let arr = [
//     //     [0,1,2],
//     //     [3,4,5]
//     // ];
//     let arr = genTileArr();
//     console.log(arr);
//     lyr.scripts[0].importFromArr(arr, 16);
//     lyr.children[0].transform.rotation.x = 45;
//     tm.scripts[0].addLayer(lyr);

//     const f = async () => {
//         let scr = tm.scripts[0]; // Should be TileMapScript
//         let t = await asset("tilesheet");
//         scr.setTileset(t);
//     }
//     f();

//     // setTimeout(() => {
//     //     cam.transform.rotation.x = 45;
//     // }, 5000);
//     return scene;
// }

const DEFAULT_SIZE = 50; // was 100
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