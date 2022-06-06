/**
 * Contains an extension to Script for use with Rendering directly to the canvas
 */

// import Script from '../Script.js';

import Script from 'jsge-core/src/components/Script.js';
import Renderable from './Renderable.component.base';

// @TODO Make this not be a script? Use as base for Sprites and Camera?

export default class RenderScript extends Renderable(Script) {

    constructor({...params}) {
        super({...params});

    }

    // Override this to render things directly to the canvas
    render(context, width, height, camTransform) {

    }
}