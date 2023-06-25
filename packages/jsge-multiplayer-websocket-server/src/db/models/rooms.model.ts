/**
 * Model for controlling rooms in the database
 */

import { Room } from "../entity/Room";
import { BaseModel } from "./baseModel";

export class RoomsModel extends BaseModel<Room> {
    constructor() {
        const room = new Room();
        super(room);
    }
}