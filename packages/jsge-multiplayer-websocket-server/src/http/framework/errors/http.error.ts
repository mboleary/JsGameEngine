export class HTTPError extends Error {
    httpCode: number = 500;
    code: string = "error"
    message: string = "Internal server error"
}