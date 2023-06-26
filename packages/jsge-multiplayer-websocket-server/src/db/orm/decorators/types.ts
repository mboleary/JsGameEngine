/**
 * Contains all type decorators for creating Entities
 */

import { getEntityProperties, registerEntity } from "../internals/typeTracker";
import { DB_TYPES } from "../types/dbTypes.enum";
import { entityFieldDefaults } from "../defaults";

export function Integer(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.type = DB_TYPES.INTEGER;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    type: DB_TYPES.INTEGER
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        type: DB_TYPES.INTEGER
                    }
                }
            });
        }
    }
}
export function Real(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.type = DB_TYPES.REAL;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    type: DB_TYPES.REAL
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        type: DB_TYPES.REAL
                    }
                }
            });
        }
    }
}
export function Text(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.type = DB_TYPES.TEXT;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    type: DB_TYPES.TEXT
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        type: DB_TYPES.TEXT
                    }
                }
            });
        }
    }
}
export function Blob(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.type = DB_TYPES.BLOB;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    type: DB_TYPES.BLOB
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        type: DB_TYPES.BLOB
                    }
                }
            });
        }
    }
}
export function PrimaryKey(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.pk = true;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    pk: true
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        pk: true
                    }
                }
            });
        }
    }
}
export function NotNull(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.nullable = false;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    nullable: false
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        nullable: false
                    }
                }
            });
        }
    }
}

