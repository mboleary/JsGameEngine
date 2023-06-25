/**
 * An implementation of DBModel that automatically generates the SQL that it needs to run at runtime
 */

import { runQuery, runQueryAll } from "../helpers";
import { SQLError } from "../orm/errors/sql.error";
import { getEntityProperties } from "../orm/internals/typeTracker";
import { DBModel } from "../orm/model";
import { SQL, sqlQuery } from "../orm/sql";
import { EntityProperties } from "../orm/types";

export class BaseModel<T> extends DBModel<T> {
    private entityProperties: EntityProperties;
    constructor(entity: T) {
        super();

        const properties = getEntityProperties((entity as any).constructor);
        if (!properties) {
            throw new SQLError(`Cannot get entityProperties for ${entity}`);
        }
        this.entityProperties = properties;
    }
    async init(): Promise<void> {
        const sql: sqlQuery[] = [];
        sql.push(SQL.createTable(this.entityProperties));
        sql.push(SQL.createIndexes(this.entityProperties));
        await runQuery(sql.map(s => s.sql).join('\n'), []);
        return;
    }
    async insert(parameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.insert(this.entityProperties, parameters);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries[0];
    }
    async findOne(whereParameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.selectAnd(this.entityProperties, whereParameters, { limit: 1 });
        const results = await runQueryAll<T>(sqlQuery.sql, sqlQuery.params);
        return results[0];
    }
    async findMany(whereParameters: Partial<T>): Promise<T[]> {
        const sqlQuery = SQL.selectAnd(this.entityProperties, whereParameters);
        const results = await runQueryAll<T>(sqlQuery.sql, sqlQuery.params);
        return results;
    }
    async updateOne(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.update(this.entityProperties, whereParameters, updateParameters, { limit: 1 });
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries[0];
    }
    async updateMany(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T[]> {
        const sqlQuery = SQL.update(this.entityProperties, whereParameters, updateParameters);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries;
    }
    async deleteOne(whereParameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.delete(this.entityProperties, whereParameters, { limit: 1 });
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries[0];
    }
    async deleteMany(whereParameters: Partial<T>): Promise<T[]> {
        const sqlQuery = SQL.delete(this.entityProperties, whereParameters);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries;
    }
}