import {Transform} from "../Transform";

export function calculateAbsoluteTransform(gos) {
    gos.forEach((go) => {
        if (!go.transform) return;
        let abs = new Transform();
        abs.deepCopy(go.transform.value);

        if (go.parent && go.parent.transform) {
            // Relative to the parent
            let parent = go.parent.transform?.value;
            if (go.parent.transform._absolute) {
                parent = go.parent.transform._absolute;
            }
            // Scale the position
            abs.position.multiply(parent.scale);
            abs.position.add(parent.position);
            abs.rotation.add(parent.rotation); // @TODO Fix rotation
            abs.scale.multiply(parent.scale);
            go.transform._absolute = abs;
        } else {
            // Relative to the origin [(0,0,0), (0,0,0), (1,1,1)]
            go.transform._absolute = abs;
        }
    });
}