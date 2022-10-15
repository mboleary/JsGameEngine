/**
 * Actual bar that deflects the ball
 */

import { RenderScript, Transform } from "jsge-module-graphics2d";

export class PongBar extends RenderScript {
    constructor({
        length = 50,
        width = 5,
        color = "#000000",
        ...params
    } = {}) {
        super({...params});

        this.length = length;
        this.width = width;
        this.color = color;
    }

    render(context, width, height, camTransform) {
        const transform = this.gameObject.transform;
        if (!transform) return;

        context.fillRect(
            transform.position.x, 
            transform.position.y, 
            transform.position.x + this.width, 
            transform.position.y + this.length
        );
    }
}