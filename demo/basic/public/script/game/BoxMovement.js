/**
 * Moves the GameObject in a box
 */

// import Script from "../engine/Script.js";
// import Transform from "../engine/Transform.js";
// import { deltaTime } from "../engine/Engine.js";

import Script from "/node_modules/jsge-core/src/Script.js";
import Transform from "/node_modules/jsge-core/src/Transform.js";
import { deltaTime } from "/node_modules/jsge-core/src/Engine.js";

const MOE = 0.001; // Margin of Error

export default class BoxMovementBehavior extends Script {
    constructor() {
        super();
        
        this.xChange = 1000;
        this.yChange = 1000;
        this.speed = 0.5; // Pixels per frame
    }

    init() {
        let t = new Transform();
        t.deepCopy(this.gameObject.transform);
        this.startPoint = t.position;
    }

    loop() {
        const p = this.gameObject.transform.position;
        const amt = this.speed * deltaTime;
        // p.x += amt;
        // p.y += amt * 0.5;
        // console.log()
        if (p.x < this.startPoint.x + this.xChange && p.y - this.startPoint.y <= MOE) {
            p.y = this.startPoint.y;
            p.x += amt;
        } else if (p.x >= this.startPoint.x + this.xChange && p.y < this.startPoint.y + this.xChange) { 
            p.x = this.startPoint.x + this.xChange; // Prevent Errors
            p.y += amt;
        } else if (p.x - this.startPoint.x >= MOE && p.y >= this.startPoint.y + this.yChange) {
            p.y = this.startPoint.y + this.yChange; // Prevent Errors
            p.x -= amt;
        } else if (p.x - this.startPoint.x <= MOE && p.y - this.startPoint.y >= MOE) {
            p.x = this.startPoint.x;
            p.y -= amt;
        }
    }
}