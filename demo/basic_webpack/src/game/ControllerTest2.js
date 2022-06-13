import GameObject from 'jsge-core/src/GameObject.js';
import Script from 'jsge-core/src/components/Script.js';
import { deltaTime, TARGET_MILLIS_PER_FRAME } from 'jsge-core/src/Engine.js';
import Transform from 'jsge-module-graphics2d/src/Transform';
import SpriteComponent from 'jsge-module-graphics2d/src/components/Sprite.component';
import TransformComponent from "jsge-module-graphics2d/src/components/Transform.component";
// import { makeSerializable } from 'jsge-core/src/Serialize.js';
import { getKeyState } from 'jsge-module-input/src/Input.js';
import { asset, load } from 'asset-loader/src/AssetLoader.js';

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

    let ctb = new ControllerTest2Script();

    let tr = new TransformComponent();

    toRet.attachComponent(spr);
    toRet.attachComponent(ctb);
    toRet.attachComponent(tr);

    

    return toRet;

}

class ControllerTest2Script extends Script {
    constructor({...params} = {}) {
        super({...params});
        this.movementAmt = 5;
        this.accel = new Transform();
    }

    init() {
    }

    loop() {
        let moveDelta = this.movementAmt * (deltaTime/TARGET_MILLIS_PER_FRAME);
        const transform = this.gameObject.transform.value;
        transform.position.add(this.accel.position);
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
// const keys = [
//     "movementAmt",
//     "transform",
//     "id",
//     "name",
//     "accel"
// ]

// function serializer(obj) {
//     console.log("Serialize ControllerTest2");
//     let toRet = {};
//     keys.forEach((key) => {
//         toRet[key] = obj[key];
//     });
//     return toRet;
// }

// function deserializer(json) {
//     console.log("Deserialize ControllerTest2");
//     let toRet = new ControllerTest2();
//     keys.forEach((key) => {
//         if (json[key]) toRet[key] = json[key];
//     });
//     return toRet;
// }

// export function stateUpdater(obj, state) {
//     keys.forEach((key) => {
//         if (state[key]) {
//             if (key === "transform") {
//                 obj.transform.deepCopy(state.transform);
//             } else if (key === "accel") {
//                 obj.accel.deepCopy(state.accel);
//             } else {
//                 Reflect.set(obj, key, state[key]);
//             }
//         }
//     });
//     return obj;
// }

// makeSerializable(ControllerTest2, serializer, deserializer, stateUpdater);