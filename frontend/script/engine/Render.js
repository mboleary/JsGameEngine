/**
 * Renders the GameObjects from the Engine
 */

import { canvas } from '../ui.js';

let context = null; // This is the context that will be used to render the game.

export function initializeWith2dContext() {
    context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
}

export function renderGameObjectsWith2dContext(gos) {
    context.clearRect(0, 0, canvas.clientWidth, canvas.height);
    gos.forEach((go) => {
        if (go.texture) {
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

function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}