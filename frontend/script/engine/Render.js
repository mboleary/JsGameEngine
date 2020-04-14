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
            let pos = go.transform.position;
            let scl = go.transform.scale;
            let rot = go.transform.rotation;
            
            context.drawImage(go.texture, pos.x, pos.y, iw * scl.x, ih * scl.y);
        }
    })
}

function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}