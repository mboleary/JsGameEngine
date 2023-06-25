/**
 * Helper functions for database
 */

import { logger } from "../logger";
import { db } from "./db";
import { QueryResults } from "./orm/types/queryResults";

export function closeDB() {
    db.close((err) => {
        if (err) {
            logger.error(err.message);
            return;
        }
        logger.debug('successfully closed sqlite database');
    });
}

export async function runQuery(sql: string, params: any[] = []): Promise<QueryResults> {
    return new Promise((res, rej) => {
        db.run(sql, params, function(err) {
            if (err) {
                rej(err);
                return;
            }
            res({
                changes: this.changes,
                lastID: this.lastID
            });
        });
    });
}

export async function runQueryAll<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((res, rej) => {
        db.all(sql, params, function(err, rows: T[]) {
            if (err) {
                rej(err);
                return;
            }
            res(rows);
        });
    });
}