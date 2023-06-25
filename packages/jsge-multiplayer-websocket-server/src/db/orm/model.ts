/**
 * Helper class to represent each model
 */

import { db } from "../db";

export abstract class DBModel<T> {
    abstract readonly name: string;
    /**
     * Create the table if not already present
     */
    abstract init(): Promise<void>;

    /**
     * Insert data into table
     * @param parameters 
     */
    abstract insert(parameters: Partial<T>): Promise<T>;

    /**
     * Find one entry
     * @param whereParameters 
     */
    abstract findOne(whereParameters: Partial<T>): Promise<T>;

    /**
     * Find multiple entries
     * @param whereParameters 
     */
    abstract findMany(whereParameters: Partial<T>): Promise<T[]>;

    /**
     * Update one entry
     * @param whereParameters 
     * @param updateParameters 
     */
    abstract updateOne(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T>;

    /**
     * Update multiple entries
     * @param whereParameters 
     * @param updateParameters 
     */
    abstract updateMany(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T[]>;

    /**
     * Delete one entry
     * @param whereParameters 
     */
    abstract deleteOne(whereParameters: Partial<T>): Promise<T>;

    /**
     * Delete multiple entries
     * @param whereParameters 
     */
    abstract deleteMany(whereParameters: Partial<T>): Promise<T[]>;

    // abstract serialize(): T[];

    /**
     * Run raw SQL with parameters
     * @param sql 
     * @param params 
     */
    abstract sql(sql: string, params: any[]): Promise<any[]>;
}