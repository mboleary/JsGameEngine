import { ComponentBase } from "jsge-core/src";
import Collider from "./Collider.interface";

export class RectangleColliderComponent extends Collider(ComponentBase) {
    constructor({height, width, ...params} = {}) {
        super({...params});

        this.height = height;
        this.width = width;
    }

    
}