/**
 * Responsible for moving the player in response to input
 */

import { Script, Engine } from "jsge-core/src";
import { Transform } from "jsge-module-graphics2d";

export class BallScript extends Script {
    constructor({...params} = {}) {
        super({...params});

        this.acceleration = new Transform();

        this.speed = 3;
        this.yMinBoundary = 0;
        this.yMaxBoundary = null; // @TODO set this from another component
    }

    loop() {
        const moveDelta = this.speed * (Engine.deltaTime / Engine.TARGET_MILLIS_PER_FRAME);
        const transform = this.gameObject.transform.value;
        transform.position.add(this.accel.position);
    }
}