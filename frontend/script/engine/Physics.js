/**
 * Handles Physics Calculations for all GameObjects, as well as updating Relative Transforms
 */

import Transform from './Transform.js';

export const jmod = {
    name: "Physics",
    loop: (internals) => calculateAbsoluteTransform(internals.gameObjects)
}

// Calculates Absolute Transform object from Relative Transforms
export function calculateAbsoluteTransform(gos) {
    gos.forEach((go) => {
        let abs = new Transform();
        abs.deepCopy(go.transform);

        if (go.parent) {
            // Relative to the parent
            let parent = go.parent.transform;
            abs.position.add(parent.position);
            // abs.rotation.add(parent.rotation); // @TODO Fix rotation
            // abs.scale.add(abs.scale); // @TODO Fix scale
            go.absTransform = abs;
        } else {
            // Relative to the origin [(0,0,0), (0,0,0), (1,1,1)]
            go.absTransform = abs;
        }
    });
}