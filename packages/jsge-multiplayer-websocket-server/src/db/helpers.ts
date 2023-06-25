/**
 * Helper functions for database
 */

import { logger } from "../logger";
import { db } from "./db";

export function closeDB() {
    db.close((err) => {
        if (err) {
            logger.error(err.message);
            return;
        }
        logger.debug('successfully closed sqlite database');
    });
}

// export function commonKeys<T>(entityKeys: Array<keyof T>, paramKeys: string[]): Array<keyof T> {
//     let commonKeys: Array<keyof T> = [];

//     let i = 0, j = 0;
//     while (i < entityKeys.length && j < paramKeys.length) {
//         const cmp = entityKeys[i].localeCompare(paramKeys[j]);
//         if (cmp === 0) {
//             commonKeys.push(entityKeys[i]);
//             i++;
//             j++;
//         } else if (cmp < 0) {
//             i++;
//         } else {
//             j++;
//         }
//     }

//     return commonKeys;
// }