/**
 * Provides an interface to control the canvas transform and rotation
 */

import GameObject from '../GameObject.js';
import Transform from '../Transform.js';
// import CameraBehavior from './CameraBehavior.js';
import { Renderable } from '../Render.js';
import { CAMERA_ID } from "../constants.js";

export class Camera extends Renderable(GameObject) {
    constructor() {
        super();
        this.id = CAMERA_ID; // There should only ever be ONE camera
        this.name = "Camera";
        // this.attachScript(new CameraBehavior(this));
    }
}