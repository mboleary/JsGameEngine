/**
 * Decorators for indexing data
 */

import { getEntityProperties, registerEntity } from "../internals/typeTracker";

export function Index(name: string, unique: boolean = false) {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            properties.indexes.push({
                name,
                unique,
                field: propertyKey
            });
        } else {
            registerEntity(target.constructor, {
                indexes: [
                    {
                        name,
                        unique,
                        field: propertyKey
                    }
                ]
            });
        }
    }
}
