export type CommonStaticMatrixInterface = {
    
}

export type CommonMatrixInterface<T> = {
    new(): T;
    add(a: T): T;
    // static
    add(a: T, b: T): T;
    adjoint(a: T): T;
    // static
    clone(a: T): T;
    // static
    copy(a: T): T;
    determinant(): number;
    equals(a: T): boolean;
    // static
    equals(a: T, b: T): boolean;
    exactEquals(a: T): boolean;
    // static
    exactEquals(a: T, b: T): boolean;

    frob(): number;
    // static
    fromRotation(rad: number): T;
    // static
    // fromScaling(v: T): T;
    // static
    // fromValues(...args: number[]): T;
    // static
    identity(): T;
    // static
    invert(a: T): T;
    // static
    LDU(L: T, D: T, U: T, a: T): T[];
    multiply(a: T): T;
    // static
    multiply(a: T, b: T): T;
    multiplyScalar(a: number): T;
    // static
    multiplyScalar(a: T, b: number): T;
    multiplyScalarAndAdd(a: T, scale: number): T;
    // static
    multiplyScalarAndAdd(a: T, b: T, scale: number): T;
    rotate(rad: number): T;
    // static
    rotate(a: T, rad: number): T;
    // scale(v: T): T;
    // static
    // scale(a: T, v: T): T;
    set(...args: number[]): T;
    subtract(a: T): T;
    // static
    subtract(a: T, b: T): T;
    // this is called 'str' in the documentation
    toString(): string;
    // static
    transpose(a: T): T;

}