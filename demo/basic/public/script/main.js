import { canvas, initUI, toggleOverlay } from './ui.js';

// import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, enrollGameObject, addJMod } from './engine/Engine.js';
import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, enrollGameObject, addJMod } from '/node_modules/jsge-core/src/Engine.js';

// import Scene from './engine/Scene.js';

// import Test from './game/Test.js';

import ControllerTest2 from './game/ControllerTest2.js';

// import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';
import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from '/node_modules/jsge-module-input/src/Input.js';



// import { serialize, deserialize, defaultStateUpdater } from './engine/Serialize.js';

// import { Puppet, convertInstanceIntoPuppet, convertPuppetIntoInstance, disablePuppetUpdates, connect, disconnect } from './engine/Puppeteer.js';
// import { Puppet, convertInstanceIntoPuppet, convertPuppetIntoInstance, disablePuppetUpdates, connect, disconnect } from '/node_modules/jsge-module-networking/src/Puppeteer.js';
// import { Camera } from './engine/Camera/Camera.js';
// import DrawsThings from './game/DrawsThings.js';

// import { load, asset, loadGroup } from './engine/Asset/AssetLoader.js';

// import { createRoom, getRooms } from './engine/Network/RoomController.js';
import { createRoom, getRooms } from '/node_modules/jsge-module-networking/src/Network/RoomController.js';

// import {jmod as inputJmod} from "./engine/Input.js";
// import {jmod as phyJmod} from "./engine/Physics.js";
// import {jmod as rendJmod} from "./engine/Render.js";
// import {jmod as pJmod} from "./engine/Puppeteer.js";
// import audioMod from './engine/Audio/Audio.js';
// import {jmod as dbgJmod} from './engine/Debug.js';


// import {jmod as inputJmod} from "/node_modules/jsge-module-input/src/Input.js";
// import {jmod as phyJmod} from "/node_modules/jsge-module-basic-physics/src/Physics.js";
// import {jmod as rendJmod} from "/node_modules/jsge-module-graphics2d/src/Render.js";
// import {jmod as pJmod} from "/node_modules/jsge-module-networking/src/Puppeteer.js";
// import audioMod from '/node_modules/jsge-module-audio/src/Audio/Audio.js';
// import {jmod as dbgJmod} from '/node_modules/jsge-module-debug/src/Debug.js';

import {spaceScene, tileScene} from './temp_scenes.js';
import { defineLoadTypes, defineAssets, loadSpaceScene, loadTileScene } from './temp_assets.js';

function initEngine() {
    // addJMod(dbgJmod);
    // addJMod(inputJmod);
    // addJMod(phyJmod);
    // addJMod(pJmod);
    // addJMod(audioMod);
    // addJMod(rendJmod);
}

function main() {
    window.numGoombas = 0;
    initUI();

    initEngine();

    // initDebug();

    window.dev = {};
    window.dev.test = () => {
        let a = window.debug.engine.gameObjects[1];
        let blacklist = ["children", "ani", "parent", "gameObject", "scripts"];
        let k = window.debug.serialize.getKeys(a.constructor, blacklist);
        console.log("Keys:", k);
        let ser = debug.serialize.defaultSerializer(k);
        let deser = debug.serialize.defaultDeserializer(k, a.constructor);
        let json = JSON.parse(JSON.stringify(ser(a)));
        console.log("Serialized:", json);
        let b = deser(json);
        console.log("Deserialized:", b);
    }
    
    defineKey("test", TYPE_DIGITAL);
    defineKey("up", TYPE_DIGITAL);
    defineKey("down", TYPE_DIGITAL);
    defineKey("left", TYPE_DIGITAL);
    defineKey("right", TYPE_DIGITAL);
    // Set Defulat Keymappings
    setKeybindings({"test":{"state":0,"mapping":["k",32],"mappingName":" ","type":1},"up":{"state":0,"mapping":["k",38],"mappingName":"ArrowUp","type":1},"down":{"state":0,"mapping":["k",40],"mappingName":"ArrowDown","type":1},"left":{"state":0,"mapping":["k",37],"mappingName":"ArrowLeft","type":1},"right":{"state":0,"mapping":["k",39],"mappingName":"ArrowRight","type":1}});
    defineLoadTypes();
    defineAssets();
    loadSpaceScene().then(() => {
        // Set the Scene
        let scene = spaceScene();
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();

        window.dev.toggleOverlay = () => {
            toggleOverlay();
        }

        // TEMP: Testing puppeteer
        // connect(window.CONFIG.pubsub); // @TODO Find a better way to handle a failed connection
        window.dev.disconnect = () => {
            // disconnect();
        }
        window.dev.createRoom = async () => {
            let room = await createRoom(window.CONFIG.rooms_api, {
                name: "JSGE Test Room",
                private: false
            });
            console.log("Room created:", room);
        }

        window.dev.getRooms = async () => {
            let rooms = await getRooms(window.CONFIG.rooms_api);
            console.log("Got rooms:", rooms);
        }
        window.dev.reconnect = (roomID) => {
            // connect(window.CONFIG.pubsub + "/" + roomID);
        }
        window.dev.testws = () => {
            // let a = new (Puppet(ControllerTest2, true))();
            // a.transform.position.x = 50;
            // enrollGameObject(a);
            // scene.attachGameObject(a);
        }

        // Change scene
        window.dev.scene = (num) => {
            let scene = null;
            const map = {
                0: {ld:loadSpaceScene, scn:spaceScene},
                1: {ld:loadTileScene, scn:tileScene}
            };
            scene = map[num];
            if (scene) {
                scene.ld().then(() => {
                    setCurrentScene(scene.scn());
                }).catch((err) => {
                    console.error(err);
                });
            }
        };




        window.dev.a = async () => {
            console.log("Creating Room...");
            let room = await createRoom(window.CONFIG.rooms_api, {
                name: "JSGE Test Room",
                private: false
            });
            console.log("Joining Room:", room);
            // connect(window.CONFIG.pubsub + "/" + room.id);
        }

        window.dev.b = async () => {
            console.log("Joining First room...");
            let rooms = await getRooms(window.CONFIG.rooms_api);
            if (rooms && rooms.length > 0) {
                console.log("Joining Room:", rooms[0]);
                // connect(window.CONFIG.pubsub + "/" + rooms[0].id);
            } else {
                console.log("No Room!");
            }
        }
    })
}

main();