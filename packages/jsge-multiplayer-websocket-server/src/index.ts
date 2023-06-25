/**
 * JSGE Websocket Server
 */

import "./config";
import {initHTTPServer} from "./http";

// initHTTPServer();
import { Room } from "./db";
import { RoomsModel } from "./db/models";
import { SQL } from "./db/orm";
import { getEntityProperties } from "./db/orm/internals/typeTracker";

console.log(Room.prototype);

const r = new Room();
r.id = 1;
console.log(r);

console.log(Object.keys(r));

// const m = new RoomsModel();
// console.log(m);

// m.init();

const roomProps = getEntityProperties(r.constructor as FunctionConstructor);

if (roomProps) {
    console.log(SQL.createTable(roomProps))
}