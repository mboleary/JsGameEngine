/**
 * Tracks types for Entities out-of-band from the Entity class
 */

import { EntityProperties } from "../types";

const trackedEntities: Map<FunctionConstructor, EntityProperties> = new Map();

export function hasEntityProperties(constructor: FunctionConstructor): boolean {
    return trackedEntities.has(constructor);
}

export function registerEntity(constructor: FunctionConstructor, properties: Partial<EntityProperties>): EntityProperties {
    const toRet: EntityProperties = {
        table: "",
        keys: {},
        indexes: [],
        ...properties,
    };
    trackedEntities.set(constructor, toRet);
    return toRet;
}

export function getEntityProperties(constructor: FunctionConstructor): EntityProperties | null {
    return trackedEntities.get(constructor) || null;
}