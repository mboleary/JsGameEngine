import {expect, jest, test} from '@jest/globals';
import { CSVLoader, CSVLoaderOptions } from '../';
import type {Asset} from "../../types";
// import mockFetch from "jest-mock-fetch";

describe("The Asset Loader Class", () => {
    const loader = new CSVLoader();

    // const mockPaths = new Map<string, any>();

    beforeAll(() => {
        // Mock fetch
        // global.fetch = jest.fn((input: URL | RequestInfo) => Promise.resolve({text: Promise.resolve(mockPaths.get(input as string))})) as jest.Mock;
    })

    test("should instantiate", () => {
        expect(loader).not.toBe(null);
    });

    // test("should load a csv file", async () => {
    //     const asset: Asset<string[][], CSVLoaderOptions> = {
    //         name: "test",
    //         loaded: false,
    //         data: null,
    //         path: "/test",
    //         type: loader.name,
    //         options: {},
    //         groups: []
    //     };

    //     const resp = await loader.load(asset);

    //     expect(resp).not.toBe(null);
    // });
})