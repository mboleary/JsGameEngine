import { mat2d, glMatrix, ReadonlyMat2 } from "gl-matrix";
import { CommonInterface } from "./interface/CommonMatrix.interface";

export class Matrix2D implements CommonInterface<Matrix2D> {
    private readonly matrix: mat2d;
    private static readonly ARRAY_LENGTH = 6;

    constructor();
    constructor(a: Matrix2D);
    constructor(a: mat2d);
    constructor(m00: number, m01: number, m10: number, m11: number);
    constructor(...args: number[] | [Matrix2D] | [mat2d]) {
        if (args?.length === 1 && args[0] instanceof Matrix2D) {
            this.matrix = mat2d.clone(args[0].matrix);
        } else if (args?.length === 1 && args[0] instanceof glMatrix.ARRAY_TYPE && args[0].length === Matrix2D.ARRAY_LENGTH) {
            this.matrix = args[0];
        } else if (args?.length === Matrix2D.ARRAY_LENGTH && typeof args[0] === "number") {
            const [a, b, c, d, tx, ty] = args;
            this.matrix = mat2d.fromValues(a, b, c, d, tx, ty);
        } else {
            this.matrix = mat2d.create();
        }
    }

    public add(a: Matrix2D): Matrix2D {
        mat2d.add(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static add(a: Matrix2D, b: Matrix2D): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.add(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }

    public static clone(a: Matrix2D): Matrix2D {
        return new Matrix2D(a);
    }

    public static copy(a: Matrix2D): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.copy(toRet.matrix, a.matrix);
        return toRet;
    }

    public determinant(): number {
        return mat2d.determinant(this.matrix);
    }

    public equals(a: Matrix2D): boolean {
        return mat2d.equals(this.matrix, a.matrix);
    }

    public static equals(a: Matrix2D, b: Matrix2D): boolean {
        return mat2d.equals(a.matrix, b.matrix);
    }
    
    public exactEquals(a: Matrix2D): boolean {
        return mat2d.exactEquals(this.matrix, a.matrix);
    }

    public static exactEquals(a: Matrix2D, b: Matrix2D): boolean {
        return mat2d.exactEquals(a.matrix, b.matrix);
    }

    public frob(): number {
        return mat2d.frob(this.matrix);
    }

    public static fromRotation(rad: number): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.fromRotation(toRet.matrix, rad);
        return toRet;
    }

    // public static fromScaling(v: Matrix2): Matrix2 {
    //     const toRet = new Matrix2();
    //     mat2.fromScaling(toRet.matrix, v.matrix);
    //     return toRet;
    // }

    public static identity(): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.identity(toRet.matrix);
        return toRet;
    }

    public static invert(a: Matrix2D): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.invert(toRet.matrix, a.matrix);
        return toRet;
    }

    public multiply(a: Matrix2D): Matrix2D {
        mat2d.multiply(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static multiply(a: Matrix2D, b: Matrix2D): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.multiply(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }
    
    public multiplyScalar(a: number | Matrix2D): Matrix2D {
        if (typeof a !== "number") {
            throw new Error("parameter 'a' must be a number");
        }
        mat2d.multiplyScalar(this.matrix, this.matrix, a);
        return this;
    }

    public static multiplyScalar(a: Matrix2D, b: number): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.multiplyScalar(toRet.matrix, a.matrix, b);
        return toRet;
    }

    public multiplyScalarAndAdd(a: Matrix2D, scale: Matrix2D | number): Matrix2D {
        if (typeof scale !== "number") {
            throw new Error("parameter 'scale' must be a number");
        }
        mat2d.multiplyScalarAndAdd(this.matrix, this.matrix, a.matrix, scale);
        return this;
    }

    public static multiplyScalarAndAdd(a: Matrix2D, b: Matrix2D, scale: number): Matrix2D {
        
        const toRet = new Matrix2D();
        mat2d.multiplyScalarAndAdd(toRet.matrix, a.matrix, b.matrix, scale);
        return toRet;
    }

    public rotate(rad: number | Matrix2D): Matrix2D {
        if (typeof rad !== "number") {
            throw new Error("parameter 'scale' must be a number");
        }
        mat2d.rotate(this.matrix, this.matrix, rad);
        return this;
    }
    public static rotate(a: Matrix2D, rad: number): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.rotate(toRet.matrix, a.matrix, rad);
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

    public set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D {
        mat2d.set(this.matrix, a, b, c, d, tx, ty);
        return this;
    }

    public subtract(a: Matrix2D): Matrix2D {
        mat2d.subtract(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static subtract(a: Matrix2D, b: Matrix2D): Matrix2D {
        const toRet = new Matrix2D();
        mat2d.subtract(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }

    public toString(): string {
        return mat2d.str(this.matrix);
    }

    public get array() {
        return this.matrix;
    }

    public get x() {
        return this.matrix[0];
    }

    public get y() {
        return this.matrix[3];
    }

}