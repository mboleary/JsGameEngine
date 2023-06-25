import { HTTPError } from "./http.error";

export class HTTPNotFoundError extends HTTPError {
    httpCode: number = 404;
    code: string = "error.not_found"
    message: string = "Item not found"
    constructor(message: string, code?: string) {
        super();
        this.message = message;
        if (code !== undefined) {
            this.code = code;
        }
    }
}