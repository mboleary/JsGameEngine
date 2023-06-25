
/**
 * Entity for storing Rooms
*/

import { Index } from "../orm/decorators/indexing";
import { ReadOnly } from "../orm/decorators/access";
import { DBEntity } from "../orm/decorators/entity";
import { PrimaryKey, Integer, Text } from "../orm/decorators/types";

@DBEntity('room')
export class Room {
    @PrimaryKey()
    @Integer()
    id: number = 0;
    
    @Text()
    @Index('idx_room_uuid', true)
    @ReadOnly()
    uuid: string = "";

    // Room is private and should not show up in the list of rooms
    @Integer()
    private: boolean = false;

    // Name of the room
    @Text()
    name: string = "";

    // Code used to enter the room
    @Text()
    code: string = "";

    // Client limit
    @Integer()
    clientLimit: number = 0;

    // Room is available to be joined
    @Integer()
    open: boolean = true;
}