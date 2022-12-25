import { vec3, glMatrix } from "gl-matrix";
import { CommonInterface, CommonStaticMatrixInterface } from "./interface/CommonMatrix.interface";

export class Vector3 implements CommonInterface<Vector3> {
    private readonly vector: vec3;
    private static readonly ARRAY_LENGTH = 3;

    constructor();
    constructor(a: Vector3);
    constructor(a: vec3);
    constructor(x: number, y: number, z: number);
    constructor(...args: number[] | [Vector3] | [vec3]) {
        if (args?.length === 1 && args[0] instanceof Vector3) {
            this.vector = vec3.clone(args[0].vector);
        } else if (args?.length === 1 && args[0] instanceof glMatrix.ARRAY_TYPE && args[0].length === Vector3.ARRAY_LENGTH) {
            this.vector = args[0];
        } else if (args?.length === Vector3.ARRAY_LENGTH && typeof args[0] === "number") {
            const [x, y, z] = args;
            this.vector = vec3.fromValues(x, y, z);
        } else {
            this.vector = vec3.create();
        }
    }

    public add(a: Vector3): Vector3 {
        vec3.add(this.vector, this.vector, a.vector);
        return this;
    }

    public static add(a: Vector3, b: Vector3): Vector3 {
        const toRet = new Vector3();
        vec3.add(toRet.vector, a.vector, b.vector);
        return toRet;
    }

    public static clone(a: Vector3): Vector3 {
        return new Vector3(a);
    }

    public static copy(a: Vector3): Vector3 {
        const toRet = new Vector3();
        vec3.copy(toRet.vector, a.vector);
        return toRet;
    }

    public equals(a: Vector3): boolean {
        return vec3.equals(this.vector, a.vector);
    }

    public static equals(a: Vector3, b: Vector3): boolean {
        return vec3.equals(a.vector, b.vector);
    }
    
    public exactEquals(a: Vector3): boolean {
        return vec3.exactEquals(this.vector, a.vector);
    }

    public static exactEquals(a: Vector3, b: Vector3): boolean {
        return vec3.exactEquals(a.vector, b.vector);
    }

    public multiply(a: Vector3): Vector3 {
        vec3.multiply(this.vector, this.vector, a.vector);
        return this;
    }

    public static multiply(a: Vector3, b: Vector3): Vector3 {
        const toRet = new Vector3();
        vec3.multiply(toRet.vector, a.vector, b.vector);
        return toRet;
    }

    public set(x: number, y: number, z: number): Vector3 {
        vec3.set(this.vector, x, y, z);
        return this;
    }

    public subtract(a: Vector3): Vector3 {
        vec3.subtract(this.vector, this.vector, a.vector);
        return this;
    }

    public static subtract(a: Vector3, b: Vector3): Vector3 {
        const toRet = new Vector3();
        vec3.subtract(toRet.vector, a.vector, b.vector);
        return toRet;
    }

    public toString(): string {
        return vec3.str(this.vector);
    }

    public get array() {
        return this.vector;
    }

    public get x() {
        return this.vector[0];
    }

    public get y() {
        return this.vector[3];
    }

}