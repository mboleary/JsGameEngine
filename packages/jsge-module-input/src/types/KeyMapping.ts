export type KeyMapping<T> = {
    submodule: string,
    controller: number,
    code: T,
    name: string,
    modifier?: number // Modify the bounded value
}