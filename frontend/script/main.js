import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import GameObject from './engine/GameObject.js';

import Script from './engine/Script.js';

import SpriteSheet from './engine/SpriteSheet.js';

let stopFrame = null;


function main() {
    initUI();

    let spritesheet = new SpriteSheet("/asset/test.png", 32, 32);
    spritesheet.ready.then(() => {

        // Set the Scene
        let scene = new Scene();
        
        let go = new GameObject();

        go.texture = spritesheet.sheet.get(15);

        go.transform.position.x = 5;

        let script = new Script();

        script.init = () => {
            console.log("Script Initialized");
        }

        script.loop = function() {
            let movementAmt = 5;
            go.transform.position.x += movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
        }.bind(script)

        go.scripts.push(script);
        
        console.log(go);
        
        scene.attachGameObject(go);
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();
    })
}

main();