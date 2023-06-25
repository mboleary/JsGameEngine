/**
 * Base entity for data types in database
 */

import { getEntityProperties, registerEntity } from "../internals/typeTracker";
import { DB_TYPES } from "../types/dbTypes.enum";



/**
 * Put this decorator on a class to turn it into an Entity
 * @param tableName name of table in db
 * @returns Function
 */
export function DBEntity(tableName: string): Function {
    return (target: FunctionConstructor) => {
        const properties = getEntityProperties(target);
        console.log("DBEntity", properties);
        if (properties) {
            properties.table = tableName;
        } else {
            registerEntity(target, {table: tableName});
        }
    }
}