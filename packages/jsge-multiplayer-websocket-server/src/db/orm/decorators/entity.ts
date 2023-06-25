/**
 * Base entity for data types in database
 */

import { getEntityProperties, registerEntity } from "../internals/typeTracker";

/**
 * Put this decorator on a class to turn it into an Entity
 * @param tableName name of table in db
 * @returns Function
 */
export function DBEntity(tableName: string): Function {
    return (target: FunctionConstructor) => {
        console.log('DBEntity target:', target);
        const properties = getEntityProperties(target);
        if (properties) {
            properties.table = tableName;
        } else {
            registerEntity(target, {table: tableName});
        }
    }
}