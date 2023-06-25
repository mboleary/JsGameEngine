/**
 * PersistedEntity is analogous to a gameObject
 */

import { DBEntity } from "../orm/decorators/entity";
import { PrimaryKey, Integer, Text } from "../orm/decorators/types";
import { ReadOnly } from "../orm/decorators/access";
import { Index } from "../orm/decorators/indexing";

@DBEntity('persisted_entity')
export class PersistedEntity {
    @PrimaryKey()
    @Integer()
    id: number = 0;

    // UUID of the gameObject
    @Text()
    @Index('persisted_entity_uuid', true)
    @ReadOnly()
    uuid: string = "";

    // UUID of the owner client
    @Text()
    ownerUuid: string = "";

    // gameObject data, will be stored separately in the model, not in db
    data: object = {};
}