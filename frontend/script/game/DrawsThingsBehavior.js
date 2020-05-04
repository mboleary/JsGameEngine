/**
 * Contains a Behavior Script for the DrawsThings.js test
 */

import RenderScript from "../engine/Camera/RenderScript.js";

const NUM_STARS = 100;

export default class DrawsThingsBehavior extends RenderScript {
    constructor() {
        super();
        this.stars = [];
        this.lastAddTime
    }

    init() {

    }

    loop() {

    }

    render(context) {
        console.log("a");
        let grad = context.createLinearGradient(20, 0, 220, 0);

        grad.addColorStop(0, 'green');
        grad.addColorStop(.5, 'cyan');
        grad.addColorStop(1, 'green');

        context.fillStyle = grad;
        context.fillRect(0, 0, context.clientWidth, context.clientHeight);
    }
}