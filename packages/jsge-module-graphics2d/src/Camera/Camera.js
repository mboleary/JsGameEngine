/**
 * Provides an interface to control the canvas transform and rotation
 */

import CameraBehavior from './CameraBehavior.js';

import GameObject from 'jsge-core/src/GameObject.js';

import { Renderable } from '../Render.js';
import { CAMERA_ID } from "../constants.js";

export class Camera extends GameObject {
    constructor() {
        super();
        this.id = CAMERA_ID; // There should only ever be ONE camera
        this.name = "Camera";
        this.attachScript(new CameraBehavior(this));
    }
}