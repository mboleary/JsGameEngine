import GameObject from '../engine/GameObject.js';
import { GameObjectWithScript } from '../engine/Script.js';

import { enrollGameObject, deleteGameObject, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

import Animation from '../engine/Animation.js';

import Transform from '../engine/Transform.js';

import { makeSerializable } from '../engine/Serialize.js';

import { getKeyState } from '../engine/Input.js';

import { asset, load } from '../engine/Asset/AssetLoader.js';

export default class ControllerTest extends GameObjectWithScript(GameObject) {
    constructor() {
        super();
        this.movementAmt = 5;
        this.transform.scale.x = 2;
        this.transform.scale.y = 2;
        load({
            name: "PLAYER",
            path: "/asset/fp/Player.png",
            type: "image"
        });
        asset("PLAYER").then((img) => {
            this.texture = img;
            // `spritesheet` is the imported spritesheet
            // let frames = [];
            // frames.push(spriteSheet.sheet.get("parakoopa_1"));
            // frames.push(spriteSheet.sheet.get("parakoopa_2"));
            // this.ani = new Animation(frames, 15);
            // this.texture = this.ani.currentFrame;
        });
        this.name = "Controller Test";
    }

    // get texture() {
    //     return this.ani.currentFrame;
    // }

    // set texture(a) {}

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

// Make the GameObject Serializable

// Keys to copy over
const keys = [
    "movementAmt",
    "transform",
    "id",
    "name"
]

function serializer(obj) {
    console.log("Serialize ControllerTest");
    let toRet = {};
    keys.forEach((key) => {
        toRet[key] = obj[key];
    });
    return toRet;
}

function deserializer(json) {
    console.log("Deserialize ControllerTest");
    let toRet = new ControllerTest();
    keys.forEach((key) => {
        if (json[key]) toRet[key] = json[key];
    });
    return toRet;
}

export function stateUpdater(obj, state) {
    keys.forEach((key) => {
        if (state[key]) Reflect.set(obj, key, state[key]);
    });
    return obj;
}

makeSerializable(ControllerTest, serializer, deserializer, stateUpdater);