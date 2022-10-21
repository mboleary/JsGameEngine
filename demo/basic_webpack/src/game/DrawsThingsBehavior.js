/**
 * Contains a Behavior Script for the DrawsThings.js test
 */

// import RenderScript from "../engine/Camera/RenderScript.js";

// import { getTime } from "../engine/Time.js";

// import { deltaTime, TARGET_MILLIS_PER_FRAME } from "../engine/Engine.js";

import {RenderScript} from "jsge-module-graphics2d/src/components/RenderScript.component";

import { getTime } from "jsge-core/src/Time.js";

import { deltaTime, TARGET_MILLIS_PER_FRAME } from "jsge-core/src/Engine.js";

const NUM_STARS = 1000;
const MAX_TRAIL = 100;
const TRAIL_TIME = 5000;
const ADD_STAR_TIME = 10;

export default class DrawsThingsBehavior extends RenderScript {
    constructor() {
        super();
        this.stars = [];
        this.lastAddTime;
        this.gradient = null;
        this.trail = 5;
        this.starSpeed = 1;
        this.addStars = false;
        this.vertSpeed = 0.25;
    }

    init() {
        this.lastAddTime = getTime();
    }

    loop() {
        this.stars.forEach((star) => {
            star.x -= star.size * this.starSpeed * (deltaTime / TARGET_MILLIS_PER_FRAME);
        })
    }

    onContextInit(context, width, height) {
        let grad = context.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(.75, '#333333');
        grad.addColorStop(1, '#000000');
        this.gradient = grad;
    }

    render(context, width, height) {
        context.fillStyle = this.gradient;
        context.fillRect(0, 0, width, height);

        this.stars.forEach((star) => {
            context.fillStyle = star.fill;
            context.fillRect(star.x, (star.y + (getTime() * this.vertSpeed)) % height, star.size * this.trail, star.size);
        });

        setTimeout(() => {
            if (this.addStars) {
                while (this.stars.length < NUM_STARS) {
                    this.addStar(width, randInt(0, height), randInt(1,5));
                }
                this.lastAddTime = getTime();
                this.addStars = false;
            } else if (this.stars.length < NUM_STARS) {
                if (this.lastAddTime + ADD_STAR_TIME < getTime()) {
                    this.addStar(width, randInt(0, height), randInt(1,5));
                    this.lastAddTime = getTime();
                }
            }
            for (let i = 0; i < this.stars.length; i++) {
                let star = this.stars[i];
                if (star.x + (star.size * this.trail) < 0) {
                    this.stars.splice(i, 1);
                    i--;
                }
            }
        })
    }

    // Assumes check is already done
    addStar(x, y, size) {
        this.stars.push({
            x: x,
            y: y,
            size: size,
            fill: randColor()
        });
    }

    test() {
        this.addStars = true;
    }

    clear = () => {
        this.stars = [];
    }
}

function randInt(min, max) {
    return (Math.random() * (max - min)) + min;
}

function randColor() {
    return `rgb(${randInt(0,255)},${randInt(0,255)},${randInt(0,255)})`;
}