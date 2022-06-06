/**
 * Contains the texture component used for rendering
 */

import ComponentBase from "jsge-core/src/ComponentBase.js";
import Renderable from "./Renderable.interface";
import {asset} from "asset-loader/src/AssetLoader.js";

export default class SpriteComponent extends Renderable(ComponentBase) {
    constructor({assetName, zIndex, ...params}) {
        super(...params);

        this._assetName = assetName;
        this.texture = null;
        this.zIndex = zIndex;
        this.hidden = false;

        asset(assetName).then((img) => {
            // @TODO handle animations and spritesheets properly
            this.texture = img;
        });
    }

    _getCurrentFrame() {
        return this.texture;
    }

    render(context, width, height, cam) {
        const tex = this._getCurrentFrame();
        const go = this.gameObject;

        // Use the texture as normal
        const iw = tex.width;
        const ih = tex.height;
        // Use the Absolute Transform, if available
        const transform = go.transform._absolute ? go.transform._absolute : go.transform.value;
        const pos = transform.position;
        const scl = transform.scale;
        // @TODO Do rotation
        const rot = transform.rotation;

        // Use the old method if rotation is not present
        if (!rot.x && !cam.rotation.x) {
            context.drawImage(tex, pos.x - cam.position.x, pos.y - cam.position.y, iw * scl.x, ih * scl.y);
        } else {
            // Translate to position. Note, this is slower
            context.setTransform(scl.x * cam.scale.x, 0, 0, scl.y * cam.scale.y, pos.x + (iw * 0.5 * scl.x) - cam.position.x, pos.y + (ih * 0.5 * scl.y) - cam.position.y);
            context.rotate(deg2rad(rot.x + cam.rotation.x));
            
            context.drawImage(tex, (iw * -0.5), (ih * -0.5), iw, ih); // Draw such that the center of the image is on (0, 0)
            context.setTransform(1,0,0,1,0,0); // Also rotates to 0
            // context.rotate(0);
        }
    }
}
