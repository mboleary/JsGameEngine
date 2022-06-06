/**
 * Contains the texture component used for rendering
 * @TODO this is now deprecated
 */

import ComponentBase from "jsge-core/src/ComponentBase.js";
import {asset} from "asset-loader/src/AssetLoader.js";

export default class TextureComponent extends ComponentBase {
    constructor({assetName, ...params}) {
        super(...params);

        this._assetName = assetName;
        this.texture = null;

        asset(assetName).then((img) => {
            // @TODO handle animations and spritesheets properly
            this.texture = img;
        });
    }
}
