/**
 * Initializes the HTTP Server
 */


import * as http from "http";
import express from "express";
import cors from "cors";

import { logger } from "../logger";

import roomsRouter from "./rooms.router";

import { config } from "../config";

export function initHTTPServer() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use('/rooms', roomsRouter);
    
    const server = http.createServer();

    server.on('request', app);

    server.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port}`);
    });
}
