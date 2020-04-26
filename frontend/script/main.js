import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, spriteSheet, enrollGameObject } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import GameObject from './engine/GameObject.js';

import Script from './engine/Script.js';

// TEST
import OPTIONS from '../asset/testOptions.js';

import Test from './game/Test.js';

import ControllerTest, { updateState } from './game/ControllerTest.js';

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';

import { initDebug } from './engine/Debug.js';

import { serialize, deserialize, updateClassState } from './engine/Serialize.js';

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
        // TEMP: Testing strange behavior
        // window.debug.engine.stopGameLoop();
        let ws = new WebSocket(window.CONFIG.backend);
        let interval = null;
        let puppets = {};
        window.dev.refreshws = () => {
            ws = new WebSocket(window.CONFIG.backend);
        }
        window.dev.clearUpdateInterval = () => {
            if (interval) {
                clearInterval(interval);
            }
        }
        window.dev.testws = () => {
            let a = new ControllerTest();
            a.transform.position.x = 50;
            enrollGameObject(a);
            scene.attachGameObject(a);
            
            let interval = setInterval(() => {
                let ser = serialize(a, false);
                let payload = {
                    action: "update",
                    target: "*",
                    data: ser
                };
                ws.send(JSON.stringify(payload));
            }, 1000);

            puppets[a.id] = {
                interval: interval,
                gameObject: a
            };
        }

        window.dev.testws2 = () => {
            "use strict" // Maybe this will fix my problem?
            ws.onmessage = (msg) => {
                "use strict"
                if (msg) {
                    let parsed = null;
                    try {
                        parsed = JSON.parse(msg.data);
                    } catch (e) {
                        console.log("NOT JSON:", msg.data);
                        return;
                    }
                    console.log("Parsed:", parsed.data);
                    if (parsed.data && parsed.data.data && parsed.data.data.id) {
                        if (puppets[parsed.data.data.id]) {
                            console.log("Updating Existing GameObject", parsed.data.data.id);
                            updateState(puppets[parsed.data.data.id].gameObject, parsed.data.data)
                        } else {
                            console.log("Adding new GameObject");
                            let deser = deserialize(parsed.data);
                            puppets[deser.id] = {
                                interval: null,
                                gameObject: deser
                            };
                            enrollGameObject(deser);
                            scene.attachGameObject(deser);
                        }
                    } else {
                        console.log("No Data");
                    }
                } else {
                    console.log("No MSG");
                }
            }
        }
    })
}

main();