/**
 * Tracks types for Entities out-of-band from the Entity class
 */

import { HTTPDataObjectProperties } from "../types";

const trackedDataObjects: Map<FunctionConstructor, HTTPDataObjectProperties> = new Map();

export function hasDataObjectProperties(constructor: FunctionConstructor): boolean {
    return trackedDataObjects.has(constructor);
}

export function registerDataObject(constructor: FunctionConstructor, properties: Partial<HTTPDataObjectProperties>): HTTPDataObjectProperties {
    const toRet: HTTPDataObjectProperties = {
        keys: {},
        ...properties,
    };
    trackedDataObjects.set(constructor, toRet);
    return toRet;
}

export function getDataObjectProperties(constructor: FunctionConstructor): HTTPDataObjectProperties | null {
    return trackedDataObjects.get(constructor) || null;
}