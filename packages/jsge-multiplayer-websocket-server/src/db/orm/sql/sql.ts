import { SQLError } from "../errors/sql.error";
import { getEntityProperties } from "../internals/typeTracker"
import { EntityField, EntityProperties } from "../types";

export type sqlQuery = {
    sql: string,
    params?: any[]
};

export type sqlOptions = {
    limit?: number;
}

export class SQL {
    static createTable<T>(properties: EntityProperties, options?: object): sqlQuery {
        return {
            sql: `CREATE TABLE IF NOT EXISTS ${resolveTableName(properties)} (
                ${Object.keys(properties.keys).map((key) => resolveCreateColumn(properties.keys[key])).join(',\n')}
            );`
        };
    }

    /**
     * Generates SQL to create specified indexes
     * @TODO does not properlt support multi-column indexes
     * @param entity Entity to generate indexes for
     * @returns 
     */
    static createIndexes<T>(properties: EntityProperties): sqlQuery {
        let sqlRows: string[] = [];

        for (const index of properties.indexes) {
            sqlRows.push(`CREATE ${index.unique ? 'UNIQUE': ''} INDEX ${index.name} ON ${properties.table}(${index.field});`);
        }

        return {
            sql: sqlRows.join('\n')
        };
    }

    static insert<T>(properties: EntityProperties, parameters: Partial<T>): sqlQuery {
        const keys = commonKeys(Object.keys(properties.keys), Object.keys(parameters));

        return {
            sql: `INSERT INTO ${properties.table} (${keys.join(', ')}) VALUES (${keys.map(val => '?').join(',')})`,
            params: keys.map((key: string) => parameters[key as keyof T])
        };
    }

    static selectAnd<T>(properties: EntityProperties, whereParameters: Partial<T>, options?: sqlOptions): sqlQuery {
        const keys = commonKeys(Object.keys(properties.keys), Object.keys(whereParameters));

        return {
            sql: `SELECT * FROM ${properties.table} WHERE ${keys.map(val => `${val} = ?`)} ${options?.limit ? `LIMIT ${options.limit}`: ''}`,
            params: keys.map((key: string) => whereParameters[key as keyof T])
        };
    }

    static update<T>(properties: EntityProperties, whereParameters: Partial<T>, updateParameters: Partial<T>, options?: sqlOptions): sqlQuery {
        const whereKeys = commonKeys(Object.keys(properties.keys), Object.keys(whereParameters));
        const updateKeys = commonKeys(Object.keys(properties.keys), Object.keys(updateParameters));

        const params = (updateKeys.map(k => updateParameters[k as keyof T])).concat(whereKeys.map(k => whereParameters[k as keyof T]));

        return {
            sql: `UPDATE ${properties.table} SET ${
                updateKeys.map(key => `${key} = ?`).join(',')
            } WHERE ${
                whereKeys.map(key => `${key} = ?`).join(',')
            } ${options?.limit ? `LIMIT ${options?.limit}`: ''}`,
            params
        };
    }

    static delete<T>(properties: EntityProperties, whereParameters: Partial<T>, options?: sqlOptions): sqlQuery {
        const keys = commonKeys(Object.keys(properties.keys), Object.keys(whereParameters));

        return {
            sql: `DELETE FROM ${properties.table} WHERE ${keys.map(k => `${k} = ?`)} ${options?.limit ? `LIMIT ${options.limit}`: ''}`,
            params: keys.map((key: string) => whereParameters[key as keyof T])
        };
    }
}

function resolveTableName(properties: EntityProperties) {
    return properties?.table;
}

function resolveCreateColumn(entityField: EntityField) {
    let colConstraints: string[] = [];
    if (entityField.pk) colConstraints.push("PRIMARY KEY");
    if (!entityField.nullable) colConstraints.push('NOT NULL');
    if (entityField.unique) colConstraints.push('UNIQUE');
    return `${entityField.name} ${entityField.type} ${colConstraints.join(' ')}`
}

function commonKeys(entityKeys: string[], paramKeys: string[]) {
    entityKeys.sort();
    paramKeys.sort();
    let common: string[] = [];

    let i = 0, j = 0;
    while (i < entityKeys.length && j < paramKeys.length) {
        const cmp = entityKeys[i].localeCompare(paramKeys[j]);
        if (cmp === 0) {
            common.push(entityKeys[i]);
            i++;
            j++;
        } else if (cmp < 0) {
            i++;
        } else {
            j++;
        }
    }

    return common;
}

function getPKField(properties: EntityProperties): EntityField | null {
    for (const key of Object.keys(properties.keys)) {
        const field = properties.keys[key];
        if (field.pk) return field;
    }
    return null;
}