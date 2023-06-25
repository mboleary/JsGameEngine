/**
 * Initialize the database
 */

import { db } from "./db";
import { RoomsModel } from "./models";
import { PersistedEntityModel } from "./models/persistedEntity.model";
import { DBModel } from "./orm";

export const models: Map<string, DBModel<any>> = new Map();

export async function initDB() {
    const arr: DBModel<any>[] = [new RoomsModel(), new PersistedEntityModel()];

    arr.forEach(instance => {
        models.set(instance.name, instance);
    });

    db.serialize(async () => {
        for (const model of models.values()) {
            await model.init();
        }
    })
}