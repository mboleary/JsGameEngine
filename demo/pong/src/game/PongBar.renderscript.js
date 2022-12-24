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

        this.trail = true;
        this.trailSize = 4;
        this.trailSpace = 1;
        this.trailColors = [
            "#eeeeeeee",
            "#cccccccc",
            "#88888888",
            "#44444444",
        ];

        this._trailCoords = [];
        this._trailIdx = 0;
        this._trailFrame = 0;

        for (let i = 0; i < this.trailSize; i++) {
            this._trailCoords[i] = {x: null, y: null};
        }
    }

    render(context, width, height, camTransform) {
        const transform = this.gameObject.transform?.value;
        if (!transform) return;

        const oldFillstyle = context.fillStyle;

        if (this.trail) {
            for (let i = 0; i < this.trailSize; i++) {
                const obj = this._trailCoords[((i + this._trailIdx) % this._trailCoords.length)];
                this._drawRect(context, obj.x, obj.y, this.trailColors[i])
            }
        }

        this._drawRect(
            context,
            transform.position.x,
            transform.position.y,
            this.color
        );

        context.fillStyle = oldFillstyle;

        if (this.trail) {
            this._trailFrame += 1;
            if (this._trailFrame % this.trailSpace === 0) {
                this._pushTrailCoords(transform.position.x, transform.position.y);
            }
        }
    }

    _pushTrailCoords(x, y) {
        const obj = this._trailCoords[(this._trailIdx++) % this.trailSize];
        obj.x = x;
        obj.y = y;
    }

    _drawRect(context, x, y, color) {
        context.fillStyle = color;
        context.fillRect(
           x, 
           y, 
            this.width, 
            this.length
        );
    }
}