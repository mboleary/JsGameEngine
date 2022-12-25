/**
 * Contains an extension to Script for use with Rendering directly to the canvas
 */

// import Script from '../Script.js';

import {Script} from 'jsge-core';
import {Renderable} from './Renderable.interface';
import { Transform } from "../Transform";

// @TODO Make this not be a script? Use as base for Sprites and Camera?

export class RenderScript extends Renderable(Script) {

    constructor({...params} = {}) {
        super({...params});
        this.transform = null;
    }

    _getTransform() {
        const goTransformArr = this.gameObject.getComponentByType(Transform);
        if (goTransformArr) {
            this.transform = goTransformArr[0];
        }
    }
}