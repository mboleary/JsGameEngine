/**
 * Moves the GameObject in a box
 */

import Script from "../engine/Script.js";
import Transform from "../engine/Transform.js";

const MOE = 0.001; // Margin of Error

export default class BoxMovementBehavior extends Script {
    constructor() {
        super();
        let t = new Transform();
        this.startPoint = t.deepCopy(this.gameObject.transform);
        this.xChange = 0;
        this.yChange = 0;
        this.speed = 5; // Pixels per frame
        this.step = 0; // Max 3
    }

    init() {

    }

    loop() {
        const p = this.gameObject.transform.position;
        if (p.x < this.startPoint.x + this.xChange && p.y - this.startPoint.y <= MOE) {
            p.x += this.speed;
        } else if (p.x >= this.startPoint.x + xChange && p.y < this.startPoint + this.xChange) { 
            p.y += this.speed;
        } else if (p.x) {
            
        }
    }
}