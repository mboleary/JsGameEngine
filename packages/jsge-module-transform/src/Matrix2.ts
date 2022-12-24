import { mat2, glMatrix, ReadonlyMat2 } from "gl-matrix";
import { CommonMatrixInterface } from "./interface/CommonMatrix.interface";

export class Matrix2 implements CommonMatrixInterface<Matrix2> {
    private readonly matrix: mat2;
    private static readonly MATRIX_LENGTH = 4;

    constructor();
    constructor(a: Matrix2);
    constructor(a: mat2);
    constructor(m00: number, m01: number, m10: number, m11: number);
    constructor(...args: number[] | [Matrix2] | [mat2]) {
        if (args?.length === 1 && args[0] instanceof Matrix2) {
            this.matrix = mat2.clone(args[0].matrix);
        } else if (args?.length === 1 && args[0] instanceof glMatrix.ARRAY_TYPE && args[0].length === Matrix2.MATRIX_LENGTH) {
            this.matrix = args[0];
        } else if (args?.length === 4 && typeof args[0] === "number") {
            const [m00, m01, m10, m11] = args;
            this.matrix = mat2.fromValues(m00, m01, m10, m11);
        } else {
            this.matrix = mat2.create();
        }
    }

    public add(a: Matrix2): Matrix2 {
        mat2.add(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static add(a: Matrix2, b: Matrix2): Matrix2 {
        const toRet = new Matrix2();
        mat2.add(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }

    public adjoint(a: Matrix2): Matrix2 {
        mat2.adjoint(this.matrix, a.matrix);
        return this;
    }

    public static clone(a: Matrix2): Matrix2 {
        return new Matrix2(a);
    }

    public static copy(a: Matrix2): Matrix2 {
        const toRet = new Matrix2();
        mat2.copy(toRet.matrix, a.matrix);
        return toRet;
    }

    public determinant(): number {
        return mat2.determinant(this.matrix);
    }

    public equals(a: Matrix2): boolean {
        return mat2.equals(this.matrix, a.matrix);
    }

    public static equals(a: Matrix2, b: Matrix2): boolean {
        return mat2.equals(a.matrix, b.matrix);
    }
    
    public exactEquals(a: Matrix2): boolean {
        return mat2.exactEquals(this.matrix, a.matrix);
    }

    public static exactEquals(a: Matrix2, b: Matrix2): boolean {
        return mat2.exactEquals(a.matrix, b.matrix);
    }

    public frob(): number {
        return mat2.frob(this.matrix);
    }

    public static fromRotation(rad: number): Matrix2 {
        const toRet = new Matrix2();
        mat2.fromRotation(toRet.matrix, rad);
        return toRet;
    }

    // public static fromScaling(v: Matrix2): Matrix2 {
    //     const toRet = new Matrix2();
    //     mat2.fromScaling(toRet.matrix, v.matrix);
    //     return toRet;
    // }

    public static identity(): Matrix2 {
        const toRet = new Matrix2();
        mat2.identity(toRet.matrix);
        return toRet;
    }

    public static invert(a: Matrix2): Matrix2 {
        const toRet = new Matrix2();
        mat2.invert(toRet.matrix, a.matrix);
        return toRet;
    }

    public static LDU(L: Matrix2, D: Matrix2, U: Matrix2, a: Matrix2): Matrix2[] {
        const result = mat2.LDU(L.matrix, D.matrix, U.matrix, a.matrix);
        return result.map((value: ReadonlyMat2) => new Matrix2(value as mat2));
    }

    public multiply(a: Matrix2): Matrix2 {
        mat2.multiply(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static multiply(a: Matrix2, b: Matrix2): Matrix2 {
        const toRet = new Matrix2();
        mat2.multiply(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }
    
    public multiplyScalar(a: number | Matrix2): Matrix2 {
        if (typeof a !== "number") {
            throw new Error("parameter 'a' must be a number");
        }
        mat2.multiplyScalar(this.matrix, this.matrix, a);
        return this;
    }

    public static multiplyScalar(a: Matrix2, b: number): Matrix2 {
        const toRet = new Matrix2();
        mat2.multiplyScalar(toRet.matrix, a.matrix, b);
        return toRet;
    }

    public multiplyScalarAndAdd(a: Matrix2, scale: Matrix2 | number): Matrix2 {
        if (typeof scale !== "number") {
            throw new Error("parameter 'scale' must be a number");
        }
        mat2.multiplyScalarAndAdd(this.matrix, this.matrix, a.matrix, scale);
        return this;
    }

    public static multiplyScalarAndAdd(a: Matrix2, b: Matrix2, scale: number): Matrix2 {
        
        const toRet = new Matrix2();
        mat2.multiplyScalarAndAdd(toRet.matrix, a.matrix, b.matrix, scale);
        return toRet;
    }

    public rotate(rad: number | Matrix2): Matrix2 {
        if (typeof rad !== "number") {
            throw new Error("parameter 'scale' must be a number");
        }
        mat2.rotate(this.matrix, this.matrix, rad);
        return this;
    }
    public static rotate(a: Matrix2, rad: number): Matrix2 {
        const toRet = new Matrix2();
        mat2.rotate(toRet.matrix, a.matrix, rad);
        return toRet;
    }

    // public scale(v: Matrix2): Matrix2 {
    //     mat2.scale(this.matrix, this.matrix, v.matrix);
    //     return this;
    // }
    // public static scale(a: Matrix2, v: Matrix2): Matrix2 {
    //     const toRet = new Matrix2();
    //     mat2.scale(toRet.matrix, a.matrix, v.matrix);
    //     return toRet;
    // }

    public set(m00: number, m01: number, m10: number, m11: number): Matrix2 {
        mat2.set(this.matrix, m00, m01, m10, m11);
        return this;
    }

    public subtract(a: Matrix2): Matrix2 {
        mat2.subtract(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static subtract(a: Matrix2, b: Matrix2): Matrix2 {
        const toRet = new Matrix2();
        mat2.subtract(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }

    public toString(): string {
        return mat2.str(this.matrix);
    }

    public static transpose(a: Matrix2): Matrix2 {
        const toRet = new Matrix2();
        mat2.transpose(toRet.matrix, a.matrix);
        return toRet;
    }

}