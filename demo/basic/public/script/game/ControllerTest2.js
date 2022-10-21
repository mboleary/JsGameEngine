// import GameObject from '../engine/GameObject.js';
// import { GameObjectWithScript } from '../engine/Script.js';

// import { enrollGameObject, deleteGameObject, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

// import Animation from '../engine/Animation.js';

// import Transform from '../engine/Transform.js';

// import { makeSerializable } from '../engine/Serialize.js';

// import { getKeyState } from '../engine/Input.js';

// import { asset, load } from '../engine/Asset/AssetLoader.js';

import GameObject from '/node_modules/jsge-core/src/GameObject.js';
import { GameObjectWithScript } from '/node_modules/jsge-core/src/Script.js';
import { deltaTime, TARGET_MILLIS_PER_FRAME } from '/node_modules/jsge-core/src/Engine.js';
import Transform from '/node_modules/jsge-core/src/Transform.js';
import { makeSerializable } from '/node_modules/jsge-core/src/Serialize.js';
import { getKeyState } from '/node_modules/jsge-module-input/src/Input.js';
import { define, load } from '/node_modules/asset-loader/src/AssetLoader.js';

export default class ControllerTest2 extends GameObjectWithScript(GameObject) {
    constructor() {
        super();
        this.movementAmt = 5;
        this.transform.scale.x = 2;
        this.transform.scale.y = 2;
        define({
            name: "PLAYER",
            path: "/asset/fp/Ship.png",
            type: "image"
        });
        load("PLAYER").then((img) => {
            this.texture = img;
            // `spritesheet` is the imported spritesheet
            // let frames = [];
            // frames.push(spriteSheet.sheet.get("parakoopa_1"));
            // frames.push(spriteSheet.sheet.get("parakoopa_2"));
            // this.ani = new Animation(frames, 15);
            // this.texture = this.ani.currentFrame;
        });
        this.name = "Controller Test";
        this.accel = new Transform();
    }

    // get texture() {
    //     return this.ani.currentFrame;
    // }

    // set texture(a) {}

    init() {
    }

    loop() {
        let moveDelta = this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
        this.transform.position.add(this.accel.position);
        if (!this.isPuppet || (this.isPuppet && this.master)) {
            if (getKeyState("up")) {
                this.accel.position.y = moveDelta * -1;
            } else if (getKeyState("down")) {
                this.accel.position.y = moveDelta;
            } else {
                this.accel.position.y = 0;
            }
            if (getKeyState("left")) {
                this.accel.position.x = moveDelta * -1;
            } else if (getKeyState("right")) {
                this.accel.position.x = moveDelta;
            } else {
                this.accel.position.x = 0;
            }
        }
        
    }

    onDestroy() {

    }
}

// Make the GameObject Serializable

// Keys to copy over
const keys = [
    "movementAmt",
    "transform",
    "id",
    "name",
    "accel"
]

function serializer(obj) {
    console.log("Serialize ControllerTest2");
    let toRet = {};
    keys.forEach((key) => {
        toRet[key] = obj[key];
    });
    return toRet;
}

function deserializer(json) {
    console.log("Deserialize ControllerTest2");
    let toRet = new ControllerTest2();
    keys.forEach((key) => {
        if (json[key]) toRet[key] = json[key];
    });
    return toRet;
}

export function stateUpdater(obj, state) {
    keys.forEach((key) => {
        if (state[key]) {
            if (key === "transform") {
                obj.transform.deepCopy(state.transform);
            } else if (key === "accel") {
                obj.accel.deepCopy(state.accel);
            } else {
                Reflect.set(obj, key, state[key]);
            }
        }
    });
    return obj;
}

makeSerializable(ControllerTest2, serializer, deserializer, stateUpdater);