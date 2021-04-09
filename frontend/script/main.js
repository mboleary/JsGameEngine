import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, enrollGameObject, addJMod } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import Test from './game/Test.js';

import ControllerTest2 from './game/ControllerTest2.js';

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';



// import { serialize, deserialize, defaultStateUpdater } from './engine/Serialize.js';

import { Puppet, convertInstanceIntoPuppet, convertPuppetIntoInstance, disablePuppetUpdates, connect, disconnect } from './engine/Puppeteer.js';
import { Camera } from './engine/Camera/Camera.js';
import DrawsThings from './game/DrawsThings.js';

import { load, asset, loadGroup } from './engine/Asset/AssetLoader.js';

import {jmod as inputJmod} from "./engine/Input.js";
import {jmod as phyJmod} from "./engine/Physics.js";
import {jmod as rendJmod} from "./engine/Render.js";
import {jmod as pJmod} from "./engine/Puppeteer.js";
import {jmod as dbgJmod} from './engine/Debug.js';

function initEngine() {
    addJMod(dbgJmod);
    addJMod(inputJmod);
    addJMod(phyJmod);
    addJMod(pJmod);
    addJMod(rendJmod);
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
    load({
        name: "0",
        path: "/asset/fp/0.png",
        type: "image",
        groups: ["main"]
    });
    load({
        name: "1",
        path: "/asset/fp/1.png",
        type: "image",
        groups: ["main"]
    });
    load({
        name: "2",
        path: "/asset/fp/2.png",
        type: "image",
        groups: ["main"]
    });
    loadGroup("main").then(() => {
        // Set the Scene
        let scene = new Scene();
        scene.attachGameObject(new DrawsThings());
        scene.attachGameObject(new Test());
        scene.attachGameObject(new ControllerTest2());
        scene.attachGameObject(new Camera());
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();

        // TEMP: Testing puppeteer
        // connect(window.CONFIG.pubsub); // @TODO Find a better way to handle a failed connection
        window.dev.disconnect = () => {
            disconnect();
        }
        window.dev.reconnect = () => {
            connect(window.CONFIG.pubsub);
        }
        window.dev.testws = () => {
            let a = new (Puppet(ControllerTest2, true))();
            a.transform.position.x = 50;
            enrollGameObject(a);
            scene.attachGameObject(a);
        }
    })
}

main();