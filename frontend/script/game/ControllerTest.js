import GameObject from '../engine/GameObject.js';
import { GameObjectWithScript } from '../engine/Script.js';

import { enrollGameObject, deleteGameObject, spriteSheet, deltaTime, TARGET_MILLIS_PER_FRAME } from '../engine/Engine.js';

import Animation from '../engine/Animation.js';

import Transform from '../engine/Transform.js';

import { makeSerializable } from '../engine/Serialize.js';

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
        this.name = "Controller Test";
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

export function updateState(obj, json) {
    console.log("Updated Transform:", json.transform.position.y);
    Object.keys(json).forEach((key) => {
        // obj[key] = JSON.parse(JSON.stringify(json[key]));
        // Note: Reflect works fine in the console, but not here for some reason
        Reflect.set(obj, key, json[key]);
    })
}

makeSerializable(ControllerTest, serializer, deserializer);