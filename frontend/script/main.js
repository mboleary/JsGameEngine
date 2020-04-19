import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, spriteSheet } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import GameObject from './engine/GameObject.js';

import Script from './engine/Script.js';

// TEST
import OPTIONS from '../asset/testOptions.js';

import Test from './game/Test.js';

import ControllerTest from './game/ControllerTest.js';

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';

function main() {
    window.numGoombas = 0;
    initUI();

    window.debug = {};
    window.debug.defineKey = defineKey;
    window.debug.TYPE_DIGITAL = TYPE_DIGITAL;
    window.debug.setKeyOnNextInput = setKeyOnNextInput;
    window.debug.getAllKeys = getAllKeys;
    window.debug.setKeybindings = setKeybindings;
    
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
        
        // let go = new GameObject();

        // go.texture = spritesheet.sheet.get("goomba_1");

        // go.transform.position.x = 5;
        // go.transform.scale.x = 4;
        // go.transform.scale.y = 4;

        // let script = new Script();

        // script.init = () => {
        //     console.log("Script Initialized");
        // }

        // script.loop = function() {
        //     let movementAmt = 5;
        //     go.transform.position.x += movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
        //     go.transform.rotation.z += 1 * (deltaTime/TARGET_MILLIS_PER_FRAME);
        // }.bind(script)

        // go.scripts.push(script);

        let go = new Test();
        
        scene.attachGameObject(go);

        let ctest = new ControllerTest();

        scene.attachGameObject(ctest);
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();
    })
}

main();