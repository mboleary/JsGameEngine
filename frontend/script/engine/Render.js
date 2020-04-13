/**
 * Renders the GameObjects from the Engine
 */

import { canvas } from '../ui.js';

let context = null; // This is the context that will be used to render the game.

export function initializeWith2dContext() {
    context = canvas.getContext('2d');
}

export function renderGameObjectsWith2dContext(gos) {
    
    gos.forEach((go) => {
        if (go.texture) {
            let pos = go.transform.position;
            context.drawImage(go.texture, pos.x, pos.z);
        }
    })
}