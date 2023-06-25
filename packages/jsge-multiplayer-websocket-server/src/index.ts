/**
 * JSGE Websocket Server
 */

import "./config";
import {initHTTPServer} from "./http";

// initHTTPServer();
import { Room, initDB, models } from "./db";
import { RoomsModel } from "./db/models";
import { SQL } from "./db/orm/sql/sql";
import { getEntityProperties } from "./db/orm/internals/typeTracker";
import { db } from "./db/db";

async function main() {
    initDB();
    models.get('room')?.insert({name: 'test', private: false, open: true});
    initHTTPServer();
}

main();