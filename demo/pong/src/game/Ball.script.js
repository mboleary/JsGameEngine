/**
 * Responsible for moving the player in response to input
 */

import { Script, Engine } from "jsge-core/src";
import { Transform } from "jsge-module-graphics2d";

import { deg2rad, randInt } from "../util";

import { PongBall } from "./PongBall.renderscript";

export class BallScript extends Script {
    constructor({...params} = {}) {
        super({...params});

        this.accel = new Transform();

        this.speed = 3;
        this.isMoving = false;
        // Direction is in degrees
        this.direction = 1;
        this.yMinBoundary = 0;
        this.yMaxBoundary = null; // @TODO set this from another component

        this._cameraComponent = null;
    }

    init() {
        const cameraGO = Engine.getGameObjectByName("camera");
        if (cameraGO) {
            this._cameraComponent = cameraGO[0].getComponentByName("CameraViewport");
        }
        this._pongBallRenderScript = this.gameObject.getComponentByName("ball_render");
        this.startMoving();
    }

    loop() {
        const moveDelta = this.speed * (Engine.deltaTime / Engine.TARGET_MILLIS_PER_FRAME);
        const transform = this.gameObject.transform.value;
        const radius = this._pongBallRenderScript.size / 2;

        if (this._cameraComponent && this.isMoving) {
            if (transform.position.y - radius <= 0) {
                // Reflect off of top (0 to 180 degrees)
                this.direction = (180 - this.direction) + 180;
                console.log("reflect top");
            } else if (transform.position.y + radius >= this._cameraComponent.viewportHeight) {
                // Reflect off of bottom (180 to 360 degrees)
                this.direction = (90 - (360 - this.direction));
                console.log("reflect bottom");
            }
            
            if (transform.position.x - radius <= 0) {
                // Reflect on left side (90 to 270 degrees)
                this.direction = ((270 - this.direction) + 270) % 360;
                console.log("reflect left");
            } else if (transform.position.x + radius >= this._cameraComponent.viewportWidth) {
                // Reflect on right side (270 to 90 (450) degrees)
                this.direction = (360 - (270 - this.direction)) % 360;
                console.log("reflect right");
            }

            const rad = deg2rad(this.direction);
            this.accel.position.x = Math.cos(rad) * moveDelta;
            this.accel.position.y = Math.sin(rad) * moveDelta;

            transform.position.add(this.accel.position);
        }
    }

    startMoving() {
        this.isMoving = true;
        this.direction = randInt(0, 359);
    }

    resetMovement() {
        this.isMoving = false;
    }
}