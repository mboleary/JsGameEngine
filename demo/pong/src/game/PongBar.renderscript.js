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
        const transform = this.gameObject.transform?.value;
        if (!transform) return;


        const oldFillstyle = context.fillStyle;

        context.fillStyle = this.color;


        context.fillRect(
            transform.position.x, 
            transform.position.y, 
            this.width, 
            this.length
        );

        context.fillStyle = oldFillstyle;
    }
}