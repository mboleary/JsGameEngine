import {expect, jest, test} from '@jest/globals';
import { AssetLoader } from '../';

describe("The Asset Loader Class", () => {
    const assetLoader = new AssetLoader();

    test("should instantiate", () => {
        expect(assetLoader).not.toBe(null);
    });

    
})