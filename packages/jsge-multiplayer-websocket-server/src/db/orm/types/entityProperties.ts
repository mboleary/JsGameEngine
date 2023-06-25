import { DB_TYPES } from "./dbTypes.enum";

export type EntityProperties = {
    keys: {[key: string]: EntityField};
    table: string;
    indexes: EntityIndexDefinition[];
}

export type EntityIndexDefinition = {
    name: string;
    field: string;
    unique: boolean
}

export type EntityField = {
    name: string,
    type: DB_TYPES | null,
    nullable: boolean,
    pk: boolean,
    readonly: boolean;
    unique: boolean;
}