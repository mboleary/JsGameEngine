import GameObject from 'jsge-core/src/GameObject.js';
import Script from 'jsge-core/src/components/Script.js';

import { deltaTime, TARGET_MILLIS_PER_FRAME } from 'jsge-core/src/Engine.js';

import SpriteComponent from "jsge-module-graphics2d/src/components/Sprite.component";

import TransformComponent from "jsge-module-graphics2d/src/components/Transform.component";

// import { makeSerializable } from 'jsge-core/src/Serialize.js';

import { getKeyState } from 'jsge-module-input/src/Input.js';

import { asset, load } from 'asset-loader/src/Asset/AssetLoader.js';

export default function controllerTestFactory() {
    load({
        name: "PLAYER",
        path: "/asset/fp/Player.png",
        type: "image"
    });
    
    let toRet = new GameObject({
        name: "Controller Test",
    });

    let spr = new SpriteComponent({
        assetName: "PLAYER",
    });

    let ctb = new ControllerTestBehavior();

    let tr = new TransformComponent();

    tr.value.scale.x = 2;
    tr.value.scale.y = 2;

    toRet.attachComponent(spr);
    toRet.attachComponent(ctb);
    toRet.attachComponent(tr);

    

    return toRet;

}

export class ControllerTestBehavior extends Script {
    constructor() {
        super();
        this.movementAmt = 5;
    }

    loop() {
        let moveDelta = this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
        const transform = this.gameObject.transform.value;
        if (getKeyState("up")) {
            transform.position.y -= moveDelta;
        } else if (getKeyState("down")) {
            transform.position.y += moveDelta;
        } 
        if (getKeyState("left")) {
            transform.position.x -= moveDelta;
        } else if (getKeyState("right")) {
            transform.position.x += moveDelta;
        }
    }
}

// Make the GameObject Serializable

// Keys to copy over
// const keys = [
//     "movementAmt",
//     "transform",
//     "id",
//     "name"
// ]

// function serializer(obj) {
//     console.log("Serialize ControllerTest");
//     let toRet = {};
//     keys.forEach((key) => {
//         toRet[key] = obj[key];
//     });
//     return toRet;
// }

// function deserializer(json) {
//     console.log("Deserialize ControllerTest");
//     let toRet = new ControllerTest();
//     keys.forEach((key) => {
//         if (json[key]) toRet[key] = json[key];
//     });
//     return toRet;
// }

// export function stateUpdater(obj, state) {
//     keys.forEach((key) => {
//         if (state[key]) Reflect.set(obj, key, state[key]);
//     });
//     return obj;
// }

// makeSerializable(ControllerTest, serializer, deserializer, stateUpdater);