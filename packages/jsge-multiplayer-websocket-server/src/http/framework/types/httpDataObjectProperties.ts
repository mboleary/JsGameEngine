import { HTTP_DATA_TYPES } from "./httpDataTypes.enum";

export type HTTPDataObjectProperties = {
    keys: {[key: string]: HTTPDataObjectField};
}

export type HTTPDataObjectField = {
    name: string,
    // Type of data in json response
    apiType: HTTP_DATA_TYPES | null,
    // Closest type of data in DB
    dbType: HTTP_DATA_TYPES | null,
    // prevent changing in update methods
    readonly: boolean,
    // field is hidden in API
    hidden: boolean
}