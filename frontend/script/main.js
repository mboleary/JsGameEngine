import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, enrollGameObject } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import Test from './game/Test.js';

import ControllerTest2 from './game/ControllerTest2.js';

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';

import { initDebug } from './engine/Debug.js';

import { serialize, deserialize, defaultStateUpdater } from './engine/Serialize.js';

import { Puppet, convertInstanceIntoPuppet, convertPuppetIntoInstance, disablePuppetUpdates, connect, disconnect } from './engine/Puppeteer.js';
import { Camera } from './engine/Camera/Camera.js';
import DrawsThings from './game/DrawsThings.js';

import { load, asset, loadGroup } from './engine/Asset/AssetLoader.js';

function main() {
    window.numGoombas = 0;
    initUI();

    initDebug();

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
    // setKeyOnNextInput("test");
    // let spritesheet = new SpriteSheet("/asset/test.png", 32, 32);
    // load({
    //     name: "MARIO_SPRITESHEET",
    //     path: "/asset/marioSpritesheetOptions.json",
    //     type: "spritesheet-options",
    //     groups: ["main"]
    // });
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
        connect(window.CONFIG.pubsub); // @TODO Find a better way to handle a failed connection
        window.dev.disconnect = () => {
            disconnect();
        }
        window.dev.reconnect = () => {
            connect(window.CONFIG.pubsub);
        }
        window.dev.testws = () => {
            let a = new (Puppet(ControllerTest2, true, 60))();
            a.transform.position.x = 50;
            enrollGameObject(a);
            scene.attachGameObject(a);
        }
    })
}

main();