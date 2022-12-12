export class InvalidKeyNameError extends Error {
    readonly _jsge_module: string = "input";
    readonly name = "InvalidKeyNameError";

    constructor(message: string) {
        super(message);
        this.message = message || "An invalid key was used";
    }
}