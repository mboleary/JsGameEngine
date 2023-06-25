/**
 * An implementation of DBModel that automatically generates the SQL that it needs to run at runtime
 */

import { logger } from "../../logger";
import { db } from "../db";
import { runQuery, runQueryAll } from "../helpers";
import { SQLError } from "../orm/errors/sql.error";
import { getEntityProperties } from "../orm/internals/typeTracker";
import { DBModel } from "../orm/model";
import { SQL, sqlQuery } from "../orm/sql/sql";
import { EntityProperties } from "../orm/types";

export class BaseModel<T> extends DBModel<T> {
    private entityProperties: EntityProperties;
    public readonly name: string;
    constructor(entity: T) {
        super();

        const properties = getEntityProperties((entity as any).constructor);
        if (!properties) {
            throw new SQLError(`Cannot get entityProperties for ${entity}`);
        }
        this.entityProperties = properties;
        this.name = properties.table;
    }
    async init(): Promise<void> {
        const sqlQueryArr: sqlQuery[] = [];
        sqlQueryArr.push(SQL.createTable(this.entityProperties));
        sqlQueryArr.push(SQL.createIndexes(this.entityProperties));
        const sql = sqlQueryArr.map(s => s.sql).join('\n');
        logger.debug(sql);
        await runQuery(sql, []);
        return;
    }
    async insert(parameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.insert(this.entityProperties, parameters);
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        logger.debug(q1.sql, q1.params);
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries[0];
    }
    async findOne(whereParameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.selectAnd(this.entityProperties, whereParameters, { limit: 1 });
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQueryAll<T>(sqlQuery.sql, sqlQuery.params);
        return results[0];
    }
    async findMany(whereParameters: Partial<T>): Promise<T[]> {
        const sqlQuery = SQL.selectAnd(this.entityProperties, whereParameters);
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQueryAll<T>(sqlQuery.sql, sqlQuery.params);
        return results;
    }
    async updateOne(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.update(this.entityProperties, whereParameters, updateParameters, { limit: 1 });
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries[0];
    }
    async updateMany(whereParameters: Partial<T>, updateParameters: Partial<T>): Promise<T[]> {
        const sqlQuery = SQL.update(this.entityProperties, whereParameters, updateParameters);
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries;
    }
    async deleteOne(whereParameters: Partial<T>): Promise<T> {
        const sqlQuery = SQL.delete(this.entityProperties, whereParameters, { limit: 1 });
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries[0];
    }
    async deleteMany(whereParameters: Partial<T>): Promise<T[]> {
        const sqlQuery = SQL.delete(this.entityProperties, whereParameters);
        logger.debug(sqlQuery.sql, sqlQuery.params);
        const results = await runQuery(sqlQuery.sql, sqlQuery.params);
        // Get entry that we just created
        const q1 = SQL.selectAnd(this.entityProperties, {id: results.lastID}, {limit: 1});
        const entries = await runQueryAll<T>(q1.sql, q1.params);
        return entries;
    }
    async sql(sql: string, params: any[] = []): Promise<any[]> {
        logger.debug(`${sql}\n[${params.join(',')}]`);
        const rows = await runQueryAll(sql, params);
        return rows;
    }
}