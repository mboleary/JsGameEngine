/**
 * Responsible for moving the player in response to input
 */

import { Script, Engine, Time } from "jsge-core";
import { Transform, TransformComponent } from "jsge-module-graphics2d";

import { deg2rad, randInt, randColor } from "../util";

const REFLECTIONS = Object.freeze({
    DEFAULT: -1,
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
});

export class BallScript extends Script {
    constructor({...params} = {}) {
        super({...params});

        this.accel = new Transform();

        this.changeColorOnReflect = true;

        this.speed = 3;
        this.isMoving = false;
        // Direction is in degrees
        this.direction = 0;
        this.yMinBoundary = 0;
        this.yMaxBoundary = null; // @TODO set this from another component

        this._lastReflectionSide = REFLECTIONS.DEFAULT;
        this._cameraComponent = null;
    }

    init() {
        const cameraGO = Engine.getGameObjectByName("camera");
        const transform = this.gameObject.getComponentByType(TransformComponent);
        const ballRender =  this.gameObject.getComponentByName("ball_render");
        if (cameraGO) {
            const temp = cameraGO[0].getComponentByName("CameraViewport");
            if (temp) this._cameraComponent = temp[0];
        }
        if (ballRender) {
            this._pongBallRenderScript = ballRender[0];
        }
        if (transform) {
            this._transform = transform[0];
        }
        this.startMoving();
    }

    loop() {
        const moveDelta = this.speed * (Time.deltaTime / Time.TARGET_MILLIS_PER_FRAME);
        const transform = this._transform.value;
        const radius = this._pongBallRenderScript.size / 2;

        if (this._cameraComponent && this.isMoving) {
            // Note: since the origin is in the top-left corner, the y-axis is reflected on the unit circle
            if (
                transform.position.y - radius <= 0 &&
                this._lastReflectionSide !== REFLECTIONS.TOP
            ) {
                // Reflect off of top (0 to 180 degrees)
                // console.log("reflect top", this.direction);
                this._lastReflectionSide = REFLECTIONS.TOP;
                // let newDir = ((180 - this.direction) + 180) % 360
                let newDir = ((90 - this.direction) + 270) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
                this._onReflect();
            } else if (
                transform.position.y + radius >= this._cameraComponent.viewportHeight &&
                this._lastReflectionSide !== REFLECTIONS.BOTTOM
            ) {
                // Reflect off of bottom (180 to 360 degrees)
                // console.log("reflect bottom", this.direction);
                this._lastReflectionSide = REFLECTIONS.BOTTOM;
                // let newDir = (90 - (180 - this.direction)) % 360;
                let newDir = ((270 - this.direction) + 270 + 180) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
                this._onReflect();
            }
            
            if (
                transform.position.x - radius <= 0 &&
                this._lastReflectionSide !== REFLECTIONS.LEFT
            ) {
                // Reflect on left side (90 to 270 degrees)
                // console.log("reflect left", this.direction);
                this._lastReflectionSide = REFLECTIONS.LEFT;
                // let newDir = ((270 - this.direction) + 270) % 360;
                let newDir = ((360 - this.direction) + 360 + 180) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
                this._onReflect();
            } else if (
                transform.position.x + radius >= this._cameraComponent.viewportWidth &&
                this._lastReflectionSide !== REFLECTIONS.RIGHT
            ) {
                // Reflect on right side (270 to 90 (450) degrees)
                // console.log("reflect right", this.direction);
                this._lastReflectionSide = REFLECTIONS.RIGHT;
                // let newDir = (this.direction + 90) % 360;
                let newDir = ((180 - this.direction) + 180 + 180) % 360;
                this.direction = newDir > 0 ? newDir : 360 + newDir;
                this._onReflect();
            }

            const rad = deg2rad(this.direction);
            this.accel.position.x = Math.cos(rad) * moveDelta;
            this.accel.position.y = Math.sin(rad) * moveDelta;

            transform.position.add(this.accel.position);
        }
    }

    _onReflect() {
        if (this.changeColorOnReflect) {
            this._pongBallRenderScript.color = randColor();
        }
    }

    startMoving() {
        this.isMoving = true;
        this.direction = randInt(0, 359);
        // this.direction = 45;
    }

    resetMovement() {
        this.isMoving = false;
    }
}