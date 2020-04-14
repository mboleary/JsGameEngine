import GameObject from '../engine/GameObject.js';
import { GameObjectWithScript } from '../engine/Script.js';

import { enrollGameObject, deleteGameObject, spriteSheet, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

import Animation from '../engine/Animation.js';

import Transform from '../engine/Transform.js';

const birth = 50; //500

const squish = 2000; //4000

const death = 1500; //3000

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
        this.squishedTimer = 0;
        this.direction = 0;
        this.birthTimer = 0;
        this.deathTimer = 0;
        this.selfReplicate = 3; // Sterilize them after a few generations so that we don't crash the browser
    }

    get texture() {
        if (this.squished) {
            return spriteSheet.sheet.get("goomba_squish");
        }
        return this.ani.currentFrame;
    }

    set texture(a) {}

    init() {
        let now = window.performance.now();
        this.birthTimer = now;
        this.squishedTimer = now;
        this.deathTimer = 0;
    }

    loop() {
        let now = window.performance.now();
        if (now - this.squishedTimer > squish) {
            this.squished = true;
        }
        if (!this.squished) {
            if (now - this.birthTimer > birth && this.selfReplicate > 0) {
                // Give Birth
                let goomba = new Test();
                goomba.direction = (this.direction + 1) % 2;
                goomba.selfReplicate = this.selfReplicate - 1;
                goomba.transform.deepCopy(this.transform);
                enrollGameObject(goomba);
                this.birthTimer = now;
            }
            if (this.direction === 0) {
                this.transform.position.x += this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
                this.transform.rotation.z += 1 * (deltaTime/TARGET_MILLIS_PER_FRAME);
            } else if (this.direction === 1) {
                this.transform.position.y += this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
            }
        } else if (!this.deathTimer) {
            this.deathTimer = now;
        } else if (now - this.deathTimer > death) {
            deleteGameObject(this);
        }
    }
}