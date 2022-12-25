import { vec2, glMatrix } from "gl-matrix";
import { CommonInterface, CommonStaticMatrixInterface } from "./interface/CommonMatrix.interface";

export class Vector2 implements CommonInterface<Vector2> {
    private readonly vector: vec2;
    private static readonly ARRAY_LENGTH = 2;

    constructor();
    constructor(a: Vector2);
    constructor(a: vec2);
    constructor(x: number, y: number);
    constructor(...args: number[] | [Vector2] | [vec2]) {
        if (args?.length === 1 && args[0] instanceof Vector2) {
            this.vector = vec2.clone(args[0].vector);
        } else if (args?.length === 1 && args[0] instanceof glMatrix.ARRAY_TYPE && args[0].length === Vector2.ARRAY_LENGTH) {
            this.vector = args[0];
        } else if (args?.length === Vector2.ARRAY_LENGTH && typeof args[0] === "number") {
            const [x, y] = args;
            this.vector = vec2.fromValues(x, y);
        } else {
            this.vector = vec2.create();
        }
    }

    public add(a: Vector2): Vector2 {
        vec2.add(this.vector, this.vector, a.vector);
        return this;
    }

    public static add(a: Vector2, b: Vector2): Vector2 {
        const toRet = new Vector2();
        vec2.add(toRet.vector, a.vector, b.vector);
        return toRet;
    }

    public static clone(a: Vector2): Vector2 {
        return new Vector2(a);
    }

    public static copy(a: Vector2): Vector2 {
        const toRet = new Vector2();
        vec2.copy(toRet.vector, a.vector);
        return toRet;
    }

    public equals(a: Vector2): boolean {
        return vec2.equals(this.vector, a.vector);
    }

    public static equals(a: Vector2, b: Vector2): boolean {
        return vec2.equals(a.vector, b.vector);
    }
    
    public exactEquals(a: Vector2): boolean {
        return vec2.exactEquals(this.vector, a.vector);
    }

    public static exactEquals(a: Vector2, b: Vector2): boolean {
        return vec2.exactEquals(a.vector, b.vector);
    }

    public multiply(a: Vector2): Vector2 {
        vec2.multiply(this.vector, this.vector, a.vector);
        return this;
    }

    public static multiply(a: Vector2, b: Vector2): Vector2 {
        const toRet = new Vector2();
        vec2.multiply(toRet.vector, a.vector, b.vector);
        return toRet;
    }

    public set(x: number, y: number): Vector2 {
        vec2.set(this.vector, x, y);
        return this;
    }

    public subtract(a: Vector2): Vector2 {
        vec2.subtract(this.vector, this.vector, a.vector);
        return this;
    }

    public static subtract(a: Vector2, b: Vector2): Vector2 {
        const toRet = new Vector2();
        vec2.subtract(toRet.vector, a.vector, b.vector);
        return toRet;
    }

    public toString(): string {
        return vec2.str(this.vector);
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