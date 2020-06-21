/**
 * Renders the GameObjects from the Engine
 */

import { canvas } from '../ui.js';
import RenderScript from './Camera/RenderScript.js';
import { init } from './Render/WebGLHelper.js';

let context = null; // This is the context that will be used to render the game.

// Legacy 2d context

export function initializeWith2dContext() {
    context = canvas.getContext('2d');
    if (!context) {
        let msg = "Error Initializing the 2d context!";
        console.error(msg);
        throw new Error(msg)
    }
    context.imageSmoothingEnabled = false;
}

export function renderGameObjectsWith2dContext(gos) {
    context.save(); // Saves the transform and such
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.restore();
    gos.forEach((go) => {
        if (go.renderScripts) {
            // Check if this is a Renderable G.O
            go.renderScripts.forEach((rs) => {
                rs.render(context, canvas.clientWidth, canvas.clientHeight);
            })
        } else if (go.texture) {
            // Use the texture as normal
            let iw = go.texture.width;
            let ih = go.texture.height;
            // Use the Absolute Transform, if available
            let transform = go.absTransform ? go.absTransform : go.transform;
            let pos = transform.position;
            let scl = transform.scale;
            let rot = transform.rotation;
            
            context.drawImage(go.texture, pos.x, pos.y, iw * scl.x, ih * scl.y);
        }
    })
}

// END Legacy

// new WebGL Context stuff

export function initializeWithWebGL() {
    context = canvas.getContext('webgl');
    if (!context) {
        let msg = "Browser Doesn't support WebGL!";
        console.error(msg);
        throw new Error(msg)
    }
    init(context);
}

export function renderGameObjectsWithWebGL(gos) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
}

// Misc. Functions and Class definitions

export function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}

export const Renderable = (Base) => class extends Base {
    constructor() {
        super();
        this.renderScripts = []; // Scripts to provide to the Renderer
    }

    attachScript(scr) {
        super.attachScript(scr);
        console.log("Attach Script:", scr.constructor.name);
        if (scr instanceof RenderScript) {
            this.renderScripts.push(scr);
            scr.renderScriptIndex = this.renderScripts.length - 1;
        }
    }

    detachScript(scr) {
        super.detachScript(scr);
        console.log("Detach Script:", scr.constructor.name);
        if (scr instanceof RenderScript && scr.renderScriptIndex >= 0) {
            this.renderScripts.splice(scr.renderScriptIndex, 1);
        }
    }
}