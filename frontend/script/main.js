import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import GameObject from './engine/GameObject.js';

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
        
        console.log(go);
        
        scene.attachGameObject(go);
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();
    })
}

main();