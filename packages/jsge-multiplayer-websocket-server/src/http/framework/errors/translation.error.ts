import { HTTPError } from "./http.error";
import { HTTP_DATA_TYPES } from "../types";

export class HTTPTranslationError extends HTTPError {
    httpCode = 400;
    code = "error.translate"
    message = ""

    constructor(from: HTTP_DATA_TYPES, to: HTTP_DATA_TYPES) {
        super();

        this.message = `There was an error translating the data from ${from} to ${to}`;
    }
}