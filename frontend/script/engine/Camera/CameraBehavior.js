/**
 * Contains the behavior for the Camera
 */

import RenderScript from './RenderScript.js';
import Transform from '../Transform.js';

import { canvas } from '../../ui.js';
import { deg2rad } from '../Render.js';

// const context = canvas.getContext('2d');

export default class CameraBehavior extends RenderScript {
    constructor(gameObject) {
        super(gameObject);
        this.prevTransform = new Transform();
    }

    init() { }

    render(context, width, height) {
        let delta = new Transform();
        delta.position.x = this.gameObject.transform.position.x - this.prevTransform.position.x;
        delta.position.y = this.gameObject.transform.position.y - this.prevTransform.position.y;
        delta.position.z = this.gameObject.transform.position.z - this.prevTransform.position.z;
        delta.rotation.x = this.gameObject.transform.rotation.x - this.prevTransform.rotation.x;
        delta.rotation.y = this.gameObject.transform.rotation.y - this.prevTransform.rotation.y;
        delta.rotation.z = this.gameObject.transform.rotation.z - this.prevTransform.rotation.z;
        // @TODO change the scale
        // @TODO make rotating around a point work
        // console.log("Delta:", delta.position, this.prevTransform.position, this.gameObject.transform.position);
        context.translate(delta.position.x * -1, delta.position.y * -1);
        context.rotate(deg2rad(delta.rotation.z));
        this.prevTransform.deepCopy(this.gameObject.transform);
    }

    onDestroy() {
        // Reset the context
        context.setTransform(1,0,0,1,0,0);
    }
}