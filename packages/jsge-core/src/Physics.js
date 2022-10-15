/**
 * Contains the function to calculate the absolute position of all GameObjects for each loop
 */

import Transform from "./Transform.js";

// Calculates Absolute Transform object from Relative Transforms
export function calculateAbsoluteTransform(gos) {
    gos.forEach((go) => {
        let abs = new Transform();
        abs.deepCopy(go.transform);

        if (go.parent) {
            // Relative to the parent
            let parent = go.parent.transform;
            if (go.parent.absTransform) {
                parent = go.parent.absTransform;
            }
            // Scale the position
            abs.position.multiply(parent.scale);
            abs.position.add(parent.position);
            abs.rotation.add(parent.rotation); // @TODO Fix rotation
            abs.scale.multiply(parent.scale);
            go.absTransform = abs;
        } else {
            // Relative to the origin [(0,0,0), (0,0,0), (1,1,1)]
            go.absTransform = abs;
        }
    });
}