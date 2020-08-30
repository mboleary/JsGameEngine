import GameObject from '../engine/GameObject.js';
import { GameObjectWithScript } from '../engine/Script.js';

import { enrollGameObject, deleteGameObject, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

import Animation from '../engine/Animation.js';

import Transform from '../engine/Transform.js';

import { getKeyState } from '../engine/Input.js';

import { makeSerializable } from '../engine/Serialize.js';

import { getTime } from '../engine/Time.js';

import { asset } from '../engine/Asset/AssetLoader.js';

let mainSpriteSheet = null;

const birth = 100; //500

const squish = 1000; //4000

const death = 1500; //3000

export default class Test extends GameObjectWithScript(GameObject) {
    constructor() {
        super();
        this.movementAmt = 5;
        this.transform.scale.x = 4;
        this.transform.scale.y = 4;
        asset("MARIO_SPRITESHEET").then((spriteSheet) => {
            mainSpriteSheet = spriteSheet;
            let frames = [];
            frames.push(spriteSheet.sheet.get("goomba_1"));
            frames.push(spriteSheet.sheet.get("goomba_2"));
            this.ani = new Animation(frames, 15);
            this.texture = this.ani.currentFrame;
        })
        this.squished = false;
        this.squishedTimer = 0;
        this.direction = 0;
        this.birthTimer = 0;
        this.deathTimer = 0;
        this.selfReplicate = 3; // Sterilize them after a few generations so that we don't crash the browser
        this.name = "Test";
    }

    get texture() {
        if (this.squished) {
            return mainSpriteSheet.sheet.get("goomba_squish");
        }
        return this.ani.currentFrame;
    }

    set texture(a) {}

    init() {
        let now = getTime();
        this.birthTimer = now;
        this.squishedTimer = now;
        this.deathTimer = 0;
    }

    loop() {
        if (getKeyState("test") === 1) {
            this.direction = (this.direction + 1) % 2;
        }
        let now = getTime();
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

    onDestroy() {
        // console.log("Destroyed");
        window.numGoombas++;
    }
}


// Make the GameObject Serializable

// Keys to copy over
const keys = [
    "movementAmt",
    "transform",
    "id",
    "name",
    "direction",
    "selfReplicate"
]

function serializer(obj) {
    console.log("Serialize Test");
    let toRet = {};
    keys.forEach((key) => {
        toRet[key] = obj[key];
    });
    return toRet;
}

function deserializer(json) {
    console.log("Deserialize Test");
    let toRet = new Test();
    keys.forEach((key) => {
        if (json[key]) toRet[key] = json[key];
    });
    return toRet;
}

function stateUpdater(obj, json) {
    console.log("State Updater");
    keys.forEach((key) => {
        if (json[key]) obj[key] = json[key];
    });
    return obj
}

makeSerializable(Test, serializer, deserializer, stateUpdater);