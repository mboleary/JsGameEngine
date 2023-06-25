import { HTTPTranslationError } from "../errors/translation.error";
import { HTTP_DATA_TYPES } from "../types";

/**
 * Translate data between API and DB layer
 * @param from 
 * @param to 
 */
export function translateValue(value: any, from: HTTP_DATA_TYPES, to: HTTP_DATA_TYPES) {
    if (from === to) {
        return value;
    }

    if (from === HTTP_DATA_TYPES.NUMBER && to === HTTP_DATA_TYPES.STRING) {
        return primativeToString(value);
    }
    if (from === HTTP_DATA_TYPES.NUMBER && to === HTTP_DATA_TYPES.BOOLEAN) {
        return numberToBoolean(value);
    }
    if (from === HTTP_DATA_TYPES.STRING && to === HTTP_DATA_TYPES.NUMBER) {
        return stringToNumber(value);
    }
    if (from === HTTP_DATA_TYPES.STRING && to === HTTP_DATA_TYPES.BOOLEAN) {
        return stringToBoolean(value);
    }
    if (from === HTTP_DATA_TYPES.BOOLEAN && to === HTTP_DATA_TYPES.NUMBER) {
        return booleanToNumber(value);
    }
    if (from === HTTP_DATA_TYPES.BOOLEAN && to === HTTP_DATA_TYPES.STRING) {
        return primativeToString(value);
    }
    if (from === HTTP_DATA_TYPES.OBJECT && to === HTTP_DATA_TYPES.STRING) {
        return structuredToString(value);
    }
    if (from === HTTP_DATA_TYPES.ARRAY && to === HTTP_DATA_TYPES.STRING) {
        return structuredToString(value);
    }
    if (from === HTTP_DATA_TYPES.STRING && to === HTTP_DATA_TYPES.OBJECT) {
        return stringToStructured(value);
    }
    if (from === HTTP_DATA_TYPES.STRING && to === HTTP_DATA_TYPES.ARRAY) {
        return stringToStructured(value);
    }

    throw new HTTPTranslationError(from, to);
}

function primativeToString(number: number | boolean): string {
    return number.toString();
}

function stringToNumber(string: string): number {
    if (string.indexOf(".") >= 0) {
        return Number.parseFloat(string);
    }
    return Number.parseInt(string);
}

function booleanToNumber(boolean: boolean): number {
    return boolean ? 1 : 0;
}

function numberToBoolean(number: number): boolean {
    return number === 1;
}

function stringToBoolean(string: string): boolean {
    return string === "true";
}

function structuredToString(structured: object | Array<any>): string {
    return JSON.stringify(structured);
}

function stringToStructured(string: string): object | Array<any> {
    return JSON.parse(string);
}