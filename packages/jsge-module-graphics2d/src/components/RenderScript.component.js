/**
 * Contains an extension to Script for use with Rendering directly to the canvas
 */

// import Script from '../Script.js';

import {Script} from 'jsge-core';
import Renderable from './Renderable.interface';

// @TODO Make this not be a script? Use as base for Sprites and Camera?

export class RenderScript extends Renderable(Script) {

    constructor({...params} = {}) {
        super({...params});
    }
}