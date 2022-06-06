/**
 * Contains an extension to Script for use with Rendering directly to the canvas
 */

// @TODO Make this not be a script? Use as base for Sprites and Camera?

export default Renderable = (Base) => class extends Base {

    constructor({...params}) {
        super({...params});
        this._renderable = true;
    }

    // Override this to render things directly to the canvas
    render(context, width, height, camTransform) {

    }
}