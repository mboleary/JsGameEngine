/**
 * Contains the spritesheet loaders for the asset loader
 */

import SpriteSheet from "../SpriteSheet";

export async function spritesheetAssetLoader(options) {
    let s = new SpriteSheet();
    s.importFromPath(options.path, options.options.width, options.options.height);
    console.log("Spritesheet");
    await s.ready;
    options.data = s;
    options.loaded = true;
    return s;
}

export async function spritesheetOptionsAssetLoader(options) {
    let resp = await fetch(options.path)
    let s = new SpriteSheet();
    let json = await resp.json();
    console.log(json);
    s.importFromOptions(json);
    await s.ready;
    options.data = s;
    options.loaded = true;
    return s;
}
