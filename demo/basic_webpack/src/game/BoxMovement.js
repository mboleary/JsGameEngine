/**
 * Moves the GameObject in a box
 */

import {Script} from "jsge-core/src/components/Script.js";
import Transform from "jsge-module-graphics2d/src/Transform.js";
import { deltaTime } from "jsge-core/src/Engine.js";

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
        t.deepCopy(this.gameObject.transform.value);
        this.startPoint = t.position;
    }

    loop() {
        const p = this.gameObject.transform.value.position;
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