/**
 * Helper class to represent each model
 */

import { db } from "../db";

export abstract class DBModel<T> {
    /**
     * Create the table if not already present
     */
    abstract init(): Promise<void>;
    abstract insert(parameters: Partial<T>): Promise<T>;
    abstract findOne(whereParameters: Partial<T>): Promise<T>;
    abstract findMany(whereParameters: Partial<T>): Promise<T[]>;
    abstract updateOne(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T>;
    abstract updateMany(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T[]>;
    abstract deleteOne(whereParameters: Partial<T>): Promise<T>;
    abstract deleteMany(whereParameters: Partial<T>): Promise<T[]>;
    // abstract serialize(): T[];
    async sql(sql: string): Promise<any[]> {
        return new Promise((res, rej) => {
            db.all(sql, (err, rows: any[]) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(rows);
            });
        });
    }
}