/**
 * Handles Physics Calculations for all GameObjects, as well as updating Relative Transforms
 */

import Transform from './Transform.js';

export const jmod = {
    name: "Physics",
    version: 0,
    loop: (internals) => {
        processColliders(internals.gameObjects);
    }
}

// Processes Collisions
export function processColliders(gos) {
    let colliders = [];
    gos.forEach((go) => {
        if (go.colliders && go.colliders.length > 0) {
            colliders.push(...go.colliders);
        }
    });

    // @TODO Use a QuadTree here or something to speed this up

    
}