/**
 * Model for controlling rooms in the database
 */

// import { v4 as uuidv4 } from "uuid";

// import { logger } from "../../logger";
// import { db } from "../db";
import { Room } from "../entity/Room";
// import { DBModel } from "../orm/model";
import { BaseModel } from "./baseModel";

export class RoomsModel extends BaseModel<Room> {
    constructor() {
        const room = new Room();
        super(room);
    }
}