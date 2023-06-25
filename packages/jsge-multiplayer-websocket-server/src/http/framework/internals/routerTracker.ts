/**
 * Tracks routers for the API
 */

import { HTTPRouterProperties } from "../types";

const trackedRouters: Map<FunctionConstructor, HTTPRouterProperties> = new Map();

export function hasRouterProperties(constructor: FunctionConstructor): boolean {
    return trackedRouters.has(constructor);
}

export function registerRouter(constructor: FunctionConstructor, properties: Partial<HTTPRouterProperties>): HTTPRouterProperties {
    const toRet: HTTPRouterProperties = {
        routes: {},
        path: "",
        ...properties,
    };
    trackedRouters.set(constructor, toRet);
    return toRet;
}

export function getRouterProperties(constructor: FunctionConstructor): HTTPRouterProperties | null {
    return trackedRouters.get(constructor) || null;
}