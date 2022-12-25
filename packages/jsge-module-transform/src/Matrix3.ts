import { mat3, glMatrix, ReadonlyMat2 } from "gl-matrix";
import { CommonMatrixInterface, CommonStaticMatrixInterface } from "./interface/CommonMatrix.interface";

export class Matrix3 implements CommonMatrixInterface<Matrix3> {
    private readonly matrix: mat3;
    private static readonly ARRAY_LENGTH = 9;

    constructor();
    constructor(a: Matrix3);
    constructor(a: mat3);
    constructor(m00:number, m01:number, m02:number, m10:number, m11:number, m12:number, m20:number, m21:number, m22:number);
    constructor(...args: number[] | [Matrix3] | [mat3]) {
        if (args?.length === 1 && args[0] instanceof Matrix3) {
            this.matrix = mat3.clone(args[0].matrix);
        } else if (args?.length === 1 && args[0] instanceof glMatrix.ARRAY_TYPE && args[0].length === Matrix3.ARRAY_LENGTH) {
            this.matrix = args[0];
        } else if (args?.length === Matrix3.ARRAY_LENGTH && typeof args[0] === "number") {
            const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = args;
            this.matrix = mat3.fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22);
        } else {
            this.matrix = mat3.create();
        }
    }

    public add(a: Matrix3): Matrix3 {
        mat3.add(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static add(a: Matrix3, b: Matrix3): Matrix3 {
        const toRet = new Matrix3();
        mat3.add(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }

    public adjoint(a: Matrix3): Matrix3 {
        mat3.adjoint(this.matrix, a.matrix);
        return this;
    }

    public static clone(a: Matrix3): Matrix3 {
        return new Matrix3(a);
    }

    public static copy(a: Matrix3): Matrix3 {
        const toRet = new Matrix3();
        mat3.copy(toRet.matrix, a.matrix);
        return toRet;
    }

    public determinant(): number {
        return mat3.determinant(this.matrix);
    }

    public equals(a: Matrix3): boolean {
        return mat3.equals(this.matrix, a.matrix);
    }

    public static equals(a: Matrix3, b: Matrix3): boolean {
        return mat3.equals(a.matrix, b.matrix);
    }
    
    public exactEquals(a: Matrix3): boolean {
        return mat3.exactEquals(this.matrix, a.matrix);
    }

    public static exactEquals(a: Matrix3, b: Matrix3): boolean {
        return mat3.exactEquals(a.matrix, b.matrix);
    }

    public frob(): number {
        return mat3.frob(this.matrix);
    }

    public static fromRotation(rad: number): Matrix3 {
        const toRet = new Matrix3();
        mat3.fromRotation(toRet.matrix, rad);
        return toRet;
    }

    // public static fromScaling(v: Matrix2): Matrix2 {
    //     const toRet = new Matrix2();
    //     mat2.fromScaling(toRet.matrix, v.matrix);
    //     return toRet;
    // }

    public static identity(): Matrix3 {
        const toRet = new Matrix3();
        mat3.identity(toRet.matrix);
        return toRet;
    }

    public static invert(a: Matrix3): Matrix3 {
        const toRet = new Matrix3();
        mat3.invert(toRet.matrix, a.matrix);
        return toRet;
    }

    public multiply(a: Matrix3): Matrix3 {
        mat3.multiply(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static multiply(a: Matrix3, b: Matrix3): Matrix3 {
        const toRet = new Matrix3();
        mat3.multiply(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }
    
    public multiplyScalar(a: number | Matrix3): Matrix3 {
        if (typeof a !== "number") {
            throw new Error("parameter 'a' must be a number");
        }
        mat3.multiplyScalar(this.matrix, this.matrix, a);
        return this;
    }

    public static multiplyScalar(a: Matrix3, b: number): Matrix3 {
        const toRet = new Matrix3();
        mat3.multiplyScalar(toRet.matrix, a.matrix, b);
        return toRet;
    }

    public multiplyScalarAndAdd(a: Matrix3, scale: Matrix3 | number): Matrix3 {
        if (typeof scale !== "number") {
            throw new Error("parameter 'scale' must be a number");
        }
        mat3.multiplyScalarAndAdd(this.matrix, this.matrix, a.matrix, scale);
        return this;
    }

    public static multiplyScalarAndAdd(a: Matrix3, b: Matrix3, scale: number): Matrix3 {
        
        const toRet = new Matrix3();
        mat3.multiplyScalarAndAdd(toRet.matrix, a.matrix, b.matrix, scale);
        return toRet;
    }

    public rotate(rad: number | Matrix3): Matrix3 {
        if (typeof rad !== "number") {
            throw new Error("parameter 'scale' must be a number");
        }
        mat3.rotate(this.matrix, this.matrix, rad);
        return this;
    }
    public static rotate(a: Matrix3, rad: number): Matrix3 {
        const toRet = new Matrix3();
        mat3.rotate(toRet.matrix, a.matrix, rad);
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

    public set(m00:number, m01:number, m02:number, m10:number, m11:number, m12:number, m20:number, m21:number, m22:number): Matrix3 {
        mat3.set(this.matrix, m00, m01, m02, m10, m11, m12, m20, m21, m22);
        return this;
    }

    public subtract(a: Matrix3): Matrix3 {
        mat3.subtract(this.matrix, this.matrix, a.matrix);
        return this;
    }

    public static subtract(a: Matrix3, b: Matrix3): Matrix3 {
        const toRet = new Matrix3();
        mat3.subtract(toRet.matrix, a.matrix, b.matrix);
        return toRet;
    }

    public toString(): string {
        return mat3.str(this.matrix);
    }

    public static transpose(a: Matrix3): Matrix3 {
        const toRet = new Matrix3();
        mat3.transpose(toRet.matrix, a.matrix);
        return toRet;
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