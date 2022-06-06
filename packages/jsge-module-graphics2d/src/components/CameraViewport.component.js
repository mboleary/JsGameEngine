/**
 * Contains an extension to Script for use with Rendering directly to the canvas
 */

// import Script from '../Script.js';

import Script from 'jsge-core/src/components/Script.js';
import Renderable from './Renderable.interface';
import { CAMERA_ID } from '../constants';
import Transform from '../Transform';

// @TODO Make this not be a script? Use as base for Sprites and Camera?

export default class CameraViewportComponent extends Renderable(Script) {

    constructor({...params}) {
        super({...params});
        this.id = CAMERA_ID;
        this.name = "CameraViewport";
        this.prevTransform = new Transform();
        this._context = null;
    }

    // Override this to render things directly to the canvas
    render(context, width, height, camTransform) {
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
        if (!this._context) {
            this._context = context;
        }
    }

    destroy() {
        this._context.setTransform(1,0,0,1,0,0);
    }
}