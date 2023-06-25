/**
 * Initializes the HTTP Server
 */


import * as http from "http";
import express from "express";
import cors from "cors";

import { logger } from "../logger";

import {RoomsRouter} from "./rooms.router";

import { config } from "../config";
import { connectRouter } from "./framework/decorators/router";

export function initHTTPServer() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    
    const server = http.createServer();

    connectRouter(app, new RoomsRouter());

    server.on('request', app);

    server.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port}`);
    });
}
