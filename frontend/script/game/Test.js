import GameObject from '../engine/GameObject.js';
import { GameObjectWithScript } from '../engine/Script.js';

import { enrollGameObject, spriteSheet, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

import Animation from '../engine/Animation.js';

export default class Test extends GameObjectWithScript(GameObject) {
    constructor() {
        super();
        this.movementAmt = 5;
        this.transform.scale.x = 4;
        this.transform.scale.y = 4;
        let frames = [];
        frames.push(spriteSheet.sheet.get("goomba_1"));
        frames.push(spriteSheet.sheet.get("goomba_2"));
        this.ani = new Animation(frames, 15);
        this.texture = this.ani.currentFrame;
        this.squished = false;
    }

    get texture() {
        if (this.squished) {
            return spriteSheet.sheet.get("goomba_squish");
        }
        return this.ani.currentFrame;
    }

    set texture(a) {}

    init() {
        console.log("GameObject Initialized!");
        console.log(this);
        setTimeout(() => {
            this.squished = true;
        }, 5000);
    }

    loop() {
        if (!this.squished) {
            this.transform.position.x += this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
            this.transform.rotation.z += 1 * (deltaTime/TARGET_MILLIS_PER_FRAME);
        }
    }
}