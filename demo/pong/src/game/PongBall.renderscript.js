/**
 * Actual bar that deflects the ball
 */

import { RenderScript, Transform } from "jsge-module-graphics2d";

export class PongBall extends RenderScript {
    constructor({
        size = 5,
        color = "#000000",
        ...params
    } = {}) {
        super({...params});

        this.size = size;
        this.color = color;
    }

    render(context, width, height, camTransform) {
        const transform = this.gameObject.transform;
        if (!transform) return;

        context.arc(
            transform.position.x, 
            transform.position.y, 
            this.size / 2,
            0,
            2 * Math.PI
        );
    }
}