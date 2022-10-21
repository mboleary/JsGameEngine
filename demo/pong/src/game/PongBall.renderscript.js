/**
 * Actual bar that deflects the ball
 */

import { RenderScript, Transform } from "jsge-module-graphics2d";

export class PongBar extends RenderScript {
    constructor({
        size = 5,
        color = "#FFFFFF",
        ...params
    } = {}) {
        super({...params});

        this.size = size;
        this.color = color;
    }

    render(context, width, height, camTransform) {
        const transform = this.gameObject.transform;
        if (!transform) return;

        context.fillRect(
            transform.position.x, 
            transform.position.y, 
            transform.position.x + this.size, 
            transform.position.y + this.size
        );
    }
}