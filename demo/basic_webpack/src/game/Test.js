// import GameObject from '../engine/GameObject.js';
// import { GameObjectWithScript } from '../engine/Script.js';

// import { enrollGameObject, deleteGameObject, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

// import { getKeyState } from '../engine/Input.js';

// import { makeSerializable } from '../engine/Serialize.js';

// import { getTime } from '../engine/Time.js';

// import { asset, load } from '../engine/Asset/AssetLoader.js';

import GameObject from 'jsge-core/src/GameObject.js';
import Script from 'jsge-core/src/components/Script.js';

import { enrollGameObject, deleteGameObject, deltaTime, TARGET_MILLIS_PER_FRAME } from 'jsge-core/src/Engine.js';

import { getKeyState } from 'jsge-module-input/src/Input.js';

import { getTime } from 'jsge-core/src/Time.js';

import { define } from 'asset-loader/src/AssetLoader.js';
import SpriteComponent from 'jsge-module-graphics2d/src/components/Sprite.component';
import TransformComponent from 'jsge-module-graphics2d/src/components/Transform.component';

let mainSpriteSheet = null;

const birth = 100; //500

const squish = 1000; //4000

const death = 2000; //3000

export default function testFactory() {
    let toRet = new GameObject({
        name: "Test"
    });

    let spr = new SpriteComponent({
        assetName: "TEST"
    });

    let tb = new TestBehavior();

    let tc = new TransformComponent();

    tc.value.scale.x = 2;
    tc.value.scale.y = 2;

    define({
        name: "TEST",
        path: "/asset/fp/S_B_1.png",
        type: "image"
    });

    toRet.attachComponent(spr);
    toRet.attachComponent(tb);
    toRet.attachComponent(tc);

    return toRet;
}

export class TestBehavior extends Script {
    constructor() {
        super();
        this.movementAmt = 5;
        
        this.squished = false;
        this.squishedTimer = 0;
        this.direction = 0;
        this.birthTimer = 0;
        this.deathTimer = 0;
        // Sterilize them after a few generations so that we don't crash the browser
        this.selfReplicate = 1; // was 3
    }

    onInit() {
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
                // @TODO replace this with prefab builder
                let goomba = testFactory();

                const testBehavior = goomba.getComponentByType(this.constructor.name);

                testBehavior.direction = (this.direction + 1) % 2;
                testBehavior.selfReplicate = this.selfReplicate - 1;
                goomba.transform.value.deepCopy(this.gameObject.transform.value);
                // Attach to the parent to ensure that it's attached to the same scene
                console.log("parent:", this.gameObject.parent);
                this.gameObject.parent.attachGameObject(goomba);
                enrollGameObject(goomba);
                console.log("new object parent:", goomba.parent);
                this.birthTimer = now;
            }
            if (this.direction === 0) {
                this.gameObject.transform.value.position.x += this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
                this.gameObject.transform.value.rotation.z += 1 * (deltaTime/TARGET_MILLIS_PER_FRAME);
            } else if (this.direction === 1) {
                this.gameObject.transform.value.position.y += this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
            }
        } else if (!this.deathTimer) {
            this.deathTimer = now;
        } else if (now - this.deathTimer > death) {
            deleteGameObject(this.gameObject);
        }
    }

    onDestroy() {
        // console.log("Destroyed");
        window.numGoombas++;
    }
}


// Make the GameObject Serializable

// Keys to copy over
// const keys = [
//     "movementAmt",
//     "transform",
//     "id",
//     "name",
//     "direction",
//     "selfReplicate"
// ]

// function serializer(obj) {
//     console.log("Serialize Test");
//     let toRet = {};
//     keys.forEach((key) => {
//         toRet[key] = obj[key];
//     });
//     return toRet;
// }

// function deserializer(json) {
//     console.log("Deserialize Test");
//     let toRet = new Test();
//     keys.forEach((key) => {
//         if (json[key]) toRet[key] = json[key];
//     });
//     return toRet;
// }

// function stateUpdater(obj, json) {
//     console.log("State Updater");
//     keys.forEach((key) => {
//         if (json[key]) obj[key] = json[key];
//     });
//     return obj
// }

// makeSerializable(Test, serializer, deserializer, stateUpdater);