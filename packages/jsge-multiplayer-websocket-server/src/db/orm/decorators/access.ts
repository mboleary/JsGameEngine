/**
 * Prevent updating certain values after entity creation
 */

import { entityFieldDefaults } from "../defaults";
import { getEntityProperties, registerEntity } from "../internals/typeTracker";

export function ReadOnly(): Function {
    return (target: any, propertyKey: string) => {
        const properties = getEntityProperties(target.constructor);
        if (properties) {
            const key = properties.keys[propertyKey];
            if (key) {
                key.readonly = true;
            } else {
                properties.keys[propertyKey] = {
                    ...entityFieldDefaults,
                    name: propertyKey,
                    readonly: true
                };
            }
        } else {
            registerEntity(target.constructor, {
                keys: {
                    [propertyKey]: {
                        ...entityFieldDefaults,
                        name: propertyKey,
                        readonly: true
                    }
                }
            });
        }
    }
}