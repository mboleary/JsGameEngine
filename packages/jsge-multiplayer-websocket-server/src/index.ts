/**
 * JSGE Websocket Server
 */

import "./config";
import {initHTTPServer} from "./http";

// initHTTPServer();
import { Room } from "./db";

console.log(Room.prototype);

const r = new Room();
r.id = 1;
console.log(r);

console.log(Object.keys(r));