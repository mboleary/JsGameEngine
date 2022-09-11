/**
 * Renders the GameObjects from the Engine
 */

// import Transform from './Transform.js';
import Transform from './Transform';

// import RenderableInterface from './components/Renderable.interface.js';
import { addCustomLoader } from 'asset-loader/src/AssetLoader';
import { ASSET_LOADERS } from './assetLoader';
import { CAMERA_ID } from "./constants.js";

import { calculateAbsoluteTransform } from "./util/transformHelpers";

let canvas = null;
let context = null; // This is the context that will be used to render the game.
let renderableComponents = []; // components that will need to be rendered

// @TODO remove this when debug stuff gets refactored
window.mod = {
    render: {
        renderableComponents
    }
};

// export const jmod = {
//     name: "Render",
//     version: 0,
//     init: initializeWith2dContext,
//     loop: (internals) => {
//         renderGameObjectsWith2dContext(internals.gameObjects);
//     }
// }

export function initializeAssetLoaders() {
    Object.keys(ASSET_LOADERS).forEach(key => addCustomLoader(key, ASSET_LOADERS[key]));
}

export function setCanvas(node) {
    canvas = node;
}

export function initializeWith2dContext() {
    if (!canvas) {
        throw new Error("Error: Canvas must be set before initializing Render!");
    }
    initializeAssetLoaders();
    context = canvas.getContext('2d');
    if (!context) {
        let msg = "Error Initializing the 2d context!";
        console.error(msg);
        throw new Error(msg)
    }
    context.imageSmoothingEnabled = false;
    if (renderableComponents.length) {
        renderableComponents.forEach((com) => com.onContextInit(context, canvas.clientWidth, canvas.clientHeight));
    }
}

export function enrollRenderableComponent(renderable) {
    // @TODO find a better way to do this
    if (renderable._renderable) {
        renderableComponents.push(renderable);
        if (context) {
            renderable.onContextInit(context, canvas.clientWidth, canvas.clientHeight);
        }
    }
    
}

export function removeRenderableComponent(renderable) {
    const id = renderable.id;
    for (let i = 0; i < renderableComponents.length; i++) {
        if (renderableComponents[i]?.id === id) {
            renderableComponents.splice(i, 1);
            return;
        }
    }
}

// Uses the Camera Object to perform calculations and rotations
export function renderGameObjectsWith2dContext(gos) {
    // @TODO remove when finished
    calculateAbsoluteTransform(gos);
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // Get the camera transform
    let cam = null;
    for (const com of renderableComponents) {
        if (com.id === CAMERA_ID) {
            cam = com.gameObject?.transform?.value;
            break;
        }
    }
    if (!cam) {
        cam = new Transform();
    }

    for (const com of renderableComponents) {
        com.render(context, canvas.clientWidth, canvas.clientHeight, cam);
    }
    // for (const go of gos) {
    //     if (go.renderScripts) {
    //         // Check if this is a Renderable G.O
    //         go.renderScripts.forEach((rs) => {
    //             rs.render(context, canvas.clientWidth, canvas.clientHeight, cam);
    //         })
    //     } else if (go.texture) {
    //         let tex = null;
    //         // Sometimes texture is a function
    //         if (typeof go.texture === "function") {
    //             tex = go.texture();
    //         } else {
    //             tex = go.texture;
    //         }
    //         // Use the texture as normal
    //         let iw = tex.width;
    //         let ih = tex.height;
    //         // Use the Absolute Transform, if available
    //         let transform = go.absTransform ? go.absTransform : go.transform;
    //         let pos = transform.position;
    //         let scl = transform.scale;
    //         // @TODO Do rotation
    //         let rot = transform.rotation;

    //         // Use the old method if rotation is not present
    //         if (!rot.x && !cam.rotation.x) {
    //             context.drawImage(tex, pos.x - cam.position.x, pos.y - cam.position.y, iw * scl.x, ih * scl.y);
    //         } else {
    //             // Translate to position. Note, this is slower
    //             context.setTransform(scl.x * cam.scale.x, 0, 0, scl.y * cam.scale.y, pos.x + (iw * 0.5 * scl.x) - cam.position.x, pos.y + (ih * 0.5 * scl.y) - cam.position.y);
    //             context.rotate(deg2rad(rot.x + cam.rotation.x));
                
    //             context.drawImage(tex, (iw * -0.5), (ih * -0.5), iw, ih); // Draw such that the center of the image is on (0, 0)
    //             context.setTransform(1,0,0,1,0,0); // Also rotates to 0
    //             // context.rotate(0);
    //         }
    //     }
    // }
    context.setTransform(1,0,0,1,0,0);
}

// @TODO rewrite transform class to calculate this automatically
