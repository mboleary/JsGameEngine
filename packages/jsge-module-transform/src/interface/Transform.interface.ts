import { Vector2 } from "../Vector2";
import { Vector3 } from "../Vector3";
import { Matrix3 } from "../Matrix3";

export interface TransformInterface {
    readonly position: Vector2;
    readonly rotation: Vector2;
    readonly scale: Vector2;

    readonly matrix: Matrix3;
}