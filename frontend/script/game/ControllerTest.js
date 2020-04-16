import GameObject from '../engine/GameObject.js';
import { GameObjectWithScript } from '../engine/Script.js';

import { enrollGameObject, deleteGameObject, spriteSheet, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

import Animation from '../engine/Animation.js';

import Transform from '../engine/Transform.js';

import { getKeyState } from '../engine/Input.js';

export default class ControllerTest extends GameObjectWithScript(GameObject) {
    constructor() {
        super();
        this.movementAmt = 5;
        this.transform.scale.x = 4;
        this.transform.scale.y = 4;
        let frames = [];
        frames.push(spriteSheet.sheet.get("parakoopa_1"));
        frames.push(spriteSheet.sheet.get("parakoopa_2"));
        this.ani = new Animation(frames, 15);
        this.texture = this.ani.currentFrame;
    }

    get texture() {
        return this.ani.currentFrame;
    }

    set texture(a) {}

    init() {
    }

    loop() {
        let moveDelta = this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
        if (getKeyState("up")) {
            this.transform.position.y -= moveDelta;
        } else if (getKeyState("down")) {
            this.transform.position.y += moveDelta;
        } 
        if (getKeyState("left")) {
            this.transform.position.x -= moveDelta;
        } else if (getKeyState("right")) {
            this.transform.position.x += moveDelta;
        }

    }

    onDestroy() {

    }
}