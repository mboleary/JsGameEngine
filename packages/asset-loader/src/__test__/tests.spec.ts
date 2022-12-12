import {expect, jest, test} from '@jest/globals';
import { AssetLoader } from '../';

test("this is a test", () => {
    const al = new AssetLoader();

    expect(al).not.toBe(null);
});