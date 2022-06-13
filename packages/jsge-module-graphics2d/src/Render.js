/**
 * Renders the GameObjects from the Engine
 */

// import Transform from './Transform.js';
import Transform from '../node_modules/jsge-core/src/Transform.js';

import RenderScript from './Camera/RenderScript.js';
import { CAMERA_ID } from "./constants.js";
import { init } from './Render/WebGLHelper.js';

let canvas = null;
let context = null; // This is the context that will be used to render the game.

export const jmod = {
    name: "Render",
    version: 0,
    init: initializeWith2dContext,
    loop: (internals) => {
        renderGameObjectsWith2dContext(internals.gameObjects);
    }
}

export const jmodWebGL = {
    name: "RenderWebGL",
    version: 0,
    init: initializeWithWebGL,
    loop: (internals) => {
        renderGameObjectsWithWebGL(internals.gameObjects);
    }
}

export function setCanvas(node) {
    canvas = node;
}

// 2d context stuff

export function initializeWith2dContext() {
    if (!canvas) {
        throw new Error("Error: Canvas must be set before initializing Render!");
    }
    context = canvas.getContext('2d');
    if (!context) {
        let msg = "Error Initializing the 2d context!";
        console.error(msg);
        throw new Error(msg)
    }
    context.imageSmoothingEnabled = false;
}

// export function renderGameObjectsWith2dContext(gos) {
//     context.save(); // Saves the transform and such
//     context.setTransform(1,0,0,1,0,0);
//     context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
//     context.restore();
//     gos.forEach((go) => {
//         if (go.renderScripts) {
//             // Check if this is a Renderable G.O
//             go.renderScripts.forEach((rs) => {
//                 rs.render(context, canvas.clientWidth, canvas.clientHeight);
//             })
//         } else if (go.texture) {
//             // Use the texture as normal
//             let iw = go.texture.width;
//             let ih = go.texture.height;
//             // Use the Absolute Transform, if available
//             let transform = go.absTransform ? go.absTransform : go.transform;
//             let pos = transform.position;
//             let scl = transform.scale;
//             let rot = transform.rotation;
            
//             context.drawImage(go.texture, pos.x, pos.y, iw * scl.x, ih * scl.y);
//         }
//     })
// }

// Uses the Camera Object to perform calculations and rotations
export function renderGameObjectsWith2dContext(gos) {
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // Get the camera transform
    let cam = null;
    let root = gos[0]; // Generally the 1st object in the array
    for (const go of gos) {
        if (go.id === CAMERA_ID) {
            cam = go.transform;
            break;
        }
    }
    if (!cam) {
        cam = new Transform();
    } else {

    }
    for (const go of gos) {
        if (go.renderScripts) {
            // Check if this is a Renderable G.O
            go.renderScripts.forEach((rs) => {
                rs.render(context, canvas.clientWidth, canvas.clientHeight, cam);
            })
        } else if (go.texture) {
            let tex = null;
            // Sometimes texture is a function
            if (typeof go.texture === "function") {
                tex = go.texture();
            } else {
                tex = go.texture;
            }
            // Use the texture as normal
            let iw = tex.width;
            let ih = tex.height;
            // Use the Absolute Transform, if available
            let transform = go.absTransform ? go.absTransform : go.transform;
            let pos = transform.position;
            let scl = transform.scale;
            // @TODO Do rotation
            let rot = transform.rotation;

            // Use the old method if rotation is not present
            if (!rot.x && !cam.rotation.x) {
                context.drawImage(tex, pos.x - cam.position.x, pos.y - cam.position.y, iw * scl.x, ih * scl.y);
            } else {
                // Translate to position. Note, this is slower
                context.setTransform(scl.x * cam.scale.x, 0, 0, scl.y * cam.scale.y, pos.x + (iw * 0.5 * scl.x) - cam.position.x, pos.y + (ih * 0.5 * scl.y) - cam.position.y);
                context.rotate(deg2rad(rot.x + cam.rotation.x));
                
                context.drawImage(tex, (iw * -0.5), (ih * -0.5), iw, ih); // Draw such that the center of the image is on (0, 0)
                context.setTransform(1,0,0,1,0,0); // Also rotates to 0
                // context.rotate(0);
            }
        }
    }
    context.setTransform(1,0,0,1,0,0);
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
        }
    }

    detachScript(scr) {
        super.detachScript(scr);
        console.log("Detach Script:", scr.constructor.name);
        if (scr instanceof RenderScript) {
            for (let i = 0; i < this.renderScripts.length; i++) {
                if (this.renderScripts[i].id === scr.id) {
                    this.renderScripts.splice(i, 1);
                    return;
                }
            }
        }
    }
}