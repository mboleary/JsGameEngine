import { ComponentBase } from "jsge-core";
import { TransformInterface } from "../interface/Transform.interface";
import { Matrix3 } from "../Matrix3";
import { Vector2 } from "../Vector2";

export class TransformComponent extends ComponentBase implements TransformInterface {
    public readonly matrix: Matrix3 = new Matrix3();
    
    // @TODO implement this 
    get position() {
        return new Vector2();
    }

    get rotation() {
        return new Vector2();
    }

    get scale() {
        return new Vector2();
    }
}