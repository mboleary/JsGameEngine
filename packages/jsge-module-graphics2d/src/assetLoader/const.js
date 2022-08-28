/**
 * Contains constants for asset loaders
 */

import { imageAssetLoader } from "./imageAssetLoader";
import { spritesheetAssetLoader, spritesheetOptionsAssetLoader } from "./spriteSheetLoader";

export const ASSET_LOADERS = {
    image: imageAssetLoader,
    spritesheet: spritesheetAssetLoader,
    "spritesheet-options": spritesheetOptionsAssetLoader
};
