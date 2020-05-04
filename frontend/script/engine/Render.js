/**
 * Renders the GameObjects from the Engine
 */

import { canvas } from '../ui.js';
import RenderScript from './Camera/RenderScript.js';

let context = null; // This is the context that will be used to render the game.

export function initializeWith2dContext() {
    context = canvas.getContext('2d');
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
                rs.render(context);
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
        if (scr instanceof RenderScript) {
            this.renderScripts.push(scr);
            scr.renderScriptIndex = this.renderScripts.length - 1;
        }
    }

    detachScript(scr) {
        super.detachScript(scr);
        if (scr instanceof RenderScript && scr.renderScriptIndex >= 0) {
            this.renderScripts.splice(scr.renderScriptIndex, 1);
        }
    }
}