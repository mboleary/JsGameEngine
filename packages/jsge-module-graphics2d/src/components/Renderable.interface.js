/**
 * Contains an extension to Script for use with Rendering directly to the canvas
 */

import {enrollRenderableComponent, removeRenderableComponent} from "../Render";

// @TODO Make this not be a script? Use as base for Sprites and Camera?

export const Renderable = (Base) => class extends Base {

    constructor({...params} = {}) {
        super({...params});
        this._renderable = true;
        
    }

    _init() {
        enrollRenderableComponent(this);
        if (super._init) super._init();
    }

    // Override to generate things when the context is first created
    onContextInit(context,  width, height) {

    }

    // Override this to render things directly to the canvas
    render(context, width, height, camTransform) {

    }

    _destroy() {
        removeRenderableComponent(this);
        if (super._destroy) super._destroy();
    }
}
