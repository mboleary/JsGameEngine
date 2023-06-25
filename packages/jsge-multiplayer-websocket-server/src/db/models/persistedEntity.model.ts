/**
 * Model for controlling rooms in the database
 */

import { PersistedEntity } from "../entity/PersistedEntity";
import { BaseModel } from "./baseModel";

export class PersistedEntityModel extends BaseModel<PersistedEntity> {
    constructor() {
        const entity = new PersistedEntity();
        super(entity);
    }
}