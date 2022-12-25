// Note that Typescript does _not_ have support for defining static members through a type or interface to a class
export type CommonStaticMatrixInterface<T> = {
    add(a: T, b: T): T;
    clone(a: T): T;
    copy(a: T): T;
    equals(a: T, b: T): boolean;
    exactEquals(a: T, b: T): boolean;
    fromRotation(rad: number): T;
    // fromScaling(v: T): T;
    // fromValues(...args: number[]): T;
    identity(): T;
    invert(a: T): T;
    LDU(L: T, D: T, U: T, a: T): T[];
    multiply(a: T, b: T): T;
    multiplyScalar(a: T, b: number): T;
    multiplyScalarAndAdd(a: T, b: T, scale: number): T;
    rotate(a: T, rad: number): T;
    // scale(a: T, v: T): T;
    subtract(a: T, b: T): T;
    transpose(a: T): T;
}

export type CommonInterface<T> = {
    add(a: T): T;
    equals(a: T): boolean;
    exactEquals(a: T): boolean;
    multiply(a: T): T;
    set(...args: number[]): T;
    subtract(a: T): T;
    // this is called 'str' in the documentation
    toString(): string;

    array: Array<number> | Float32Array;
    x: number;
    y: number;
    z?: number;
}

export type CommonMatrixInterface<T> = {
    add(a: T): T;
    adjoint(a: T): T;
    determinant(): number;
    equals(a: T): boolean;
    exactEquals(a: T): boolean;
    frob(): number;
    multiply(a: T): T;
    multiplyScalar(a: number): T;
    multiplyScalarAndAdd(a: T, scale: number): T;
    rotate(rad: number): T;
    // scale(v: T): T;
    set(...args: number[]): T;
    subtract(a: T): T;
    // this is called 'str' in the documentation
    toString(): string;

    array: Array<number> | Float32Array;
    x: number;
    y: number;
    z?: number;
}

