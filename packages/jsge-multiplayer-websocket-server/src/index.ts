/**
 * JSGE Websocket Server
 */

import "./config";
import {initHTTPServer} from "./http";
import { initDB } from "./db";

async function main() {
    initDB();
    initHTTPServer();
}

main();