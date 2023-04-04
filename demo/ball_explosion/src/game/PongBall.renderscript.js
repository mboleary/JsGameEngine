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
        const transform = this.transform?.value;
        if (!transform) return;

        const oldFillstyle = context.fillStyle;

        if (this.trail) {
            for (let i = 0; i < this.trailSize; i++) {
                const obj = this._trailCoords[((i + this._trailIdx) % this._trailCoords.length)];
                this._drawCircle(context, obj.x, obj.y, this.trailColors[i])
            }
        }

        this._drawCircle(
            context,
            transform.position.x,
            transform.position.y,
            this.color
        );

        // Because `this._drawCircle` changes the `fillStyle`, we need to set it back to the original value
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

    _drawCircle(context, x, y, color) {
        context.fillStyle = color;

        context.beginPath();

        context.arc(
            x, 
            y, 
            this.size / 2,
            0,
            2 * Math.PI
        );

        context.fill();
    }
}