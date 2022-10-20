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
            // Note: since the origin is in the top-left corner, the y-axis is reflected on the unit circle
            if (
                transform.position.y - radius <= 0 &&
                this.direction >= 180 && 
                this.direction <= 360
            ) {
                // Reflect off of top (0 to 180 degrees)
                console.log("reflect top", this.direction);
                let newDir = ((180 - this.direction) + 180) % 360
                this.direction = newDir > 0 ? newDir : 360 + newDir;
            } else if (
                transform.position.y + radius >= this._cameraComponent.viewportHeight &&
                this.direction >= 0 && 
                this.direction <= 180
            ) {
                // Reflect off of bottom (180 to 360 degrees)
                console.log("reflect bottom", this.direction);
                let newDir = (90 - (180 - this.direction)) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
            }
            
            if (
                transform.position.x - radius <= 0 &&
                this.direction >= 90 && 
                this.direction <= 270
            ) {
                // Reflect on left side (90 to 270 degrees)
                console.log("reflect left", this.direction);
                let newDir = ((270 - this.direction) + 270) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
            } else if (
                transform.position.x + radius >= this._cameraComponent.viewportWidth &&
                (this.direction >= 270 ||
                this.direction <= 90)
            ) {
                // Reflect on right side (270 to 90 (450) degrees)
                console.log("reflect right", this.direction);
                let newDir = (this.direction - 90) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
            }

            const rad = deg2rad(this.direction);
            this.accel.position.x = Math.cos(rad) * moveDelta;
            this.accel.position.y = Math.sin(rad) * moveDelta;

            transform.position.add(this.accel.position);
        }
    }

    startMoving() {
        this.isMoving = true;
        // this.direction = randInt(0, 359);
        this.direction = 45;
    }

    resetMovement() {
        this.isMoving = false;
    }
}