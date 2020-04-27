import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, spriteSheet, enrollGameObject } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import GameObject from './engine/GameObject.js';

import Script from './engine/Script.js';

// TEST
import OPTIONS from '../asset/testOptions.js';

import Test from './game/Test.js';

import ControllerTest from './game/ControllerTest.js';

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';

import { initDebug } from './engine/Debug.js';

import { serialize, deserialize, defaultStateUpdater } from './engine/Serialize.js';

import { Puppet, convertInstanceIntoPuppet, convertPuppetIntoInstance, disablePuppetUpdates, connect, disconnect } from './engine/Puppeteer.js';

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
    setKeyOnNextInput("test");
    // let spritesheet = new SpriteSheet("/asset/test.png", 32, 32);
    spriteSheet.importFromOptions(OPTIONS);
    spriteSheet.ready.then(() => {

        // Set the Scene
        let scene = new Scene();
        scene.attachGameObject(new Test());
        scene.attachGameObject(new ControllerTest());
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();

        // TEMP: Testing puppeteer
        connect(window.CONFIG.pubsub);
        window.dev.disconnect = () => {
            disconnect();
        }
        window.dev.reconnect = () => {
            connect(window.CONFIG.pubsub);
        }
        window.dev.testws = () => {
            let a = new (Puppet(ControllerTest, true))();
            a.transform.position.x = 50;
            enrollGameObject(a);
            scene.attachGameObject(a);
        }
    })
}

main();