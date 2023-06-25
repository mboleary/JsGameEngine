/**
 * Decorators to help with translation for the REST endpoints
 */

import { getDataObjectProperties, registerDataObject } from "../internals/typeTracker";
import { HTTP_DATA_TYPES } from "../types";
import { httpDataObjectFieldDefaults } from "../defaults";

export function Translate(api: HTTP_DATA_TYPES, db: HTTP_DATA_TYPES): Function {
    return (target: any, propertyKey: string) => {
        const properties = getDataObjectProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.apiType = api;
                key.dbType = db;
            } else {
                properties.keys[propertyKey] = {
                    ...httpDataObjectFieldDefaults,
                    name: propertyKey,
                    apiType: api,
                    dbType: db,
                };
            }
        } else {
            registerDataObject(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...httpDataObjectFieldDefaults,
                        name: propertyKey,
                        apiType: api,
                        dbType: db,
                    }
                }
            });
        }
    }
}

export function ReadOnly(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getDataObjectProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.readonly = true
            } else {
                properties.keys[propertyKey] = {
                    ...httpDataObjectFieldDefaults,
                    name: propertyKey,
                    readonly: true
                };
            }
        } else {
            registerDataObject(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...httpDataObjectFieldDefaults,
                        name: propertyKey,
                        readonly: true
                    }
                }
            });
        }
    }
}

export function Hidden(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getDataObjectProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.hidden = true;
            } else {
                properties.keys[propertyKey] = {
                    ...httpDataObjectFieldDefaults,
                    name: propertyKey,
                    hidden: true
                };
            }
        } else {
            registerDataObject(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...httpDataObjectFieldDefaults,
                        name: propertyKey,
                        hidden: true
                    }
                }
            });
        }
    }
}