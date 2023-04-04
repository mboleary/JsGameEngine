export type KeyMapping<T> = {
    submodule: string,
    controller: number,
    code: T, // input keycode
    name: string, // friendly name of the input
    modifier?: number // Modify the bounded value
}