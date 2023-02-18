/**
 * Responsible for moving the player in response to input
 */

import { Script, Time, Engine } from "jsge-core";
import { Transform, TransformComponent } from "jsge-module-graphics2d";
import { InputModule } from "jsge-module-input";

export class PlayerScript extends Script {
    constructor({...params} = {}) {
        super({...params});

        this.accel = new Transform();

        this.speed = 5;
        this.yMinBoundary = 0;
        this.yMaxBoundary = null; // @TODO set this from another component
    }

    init() {
        const transform = this.gameObject.getComponentByType(TransformComponent);
        if (transform) {
            this._transform = transform[0];
        }
    }

    loop() {
        const moveDelta = this.speed * (Time.deltaTime / Time.TARGET_MILLIS_PER_FRAME);
        const transform = this._transform.value;
        transform.position.add(this.accel.position);

        const inputModule = Engine.modules.input;

        if (inputModule.getKey("up")) {
            this.accel.position.y = moveDelta * -1;
        } else if (inputModule.getKey("down")) {
            this.accel.position.y = moveDelta;
        } else {
            this.accel.position.y = 0;
        }
        if (inputModule.getKey("left")) {
            this.accel.position.x = moveDelta * -1;
        } else if (inputModule.getKey("right")) {
            this.accel.position.x = moveDelta;
        } else {
            this.accel.position.x = 0;
        }
    }
}