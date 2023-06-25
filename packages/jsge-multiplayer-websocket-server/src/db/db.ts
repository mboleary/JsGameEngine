/**
 * Sets up the in-memory database
 */

import sqlite3 from "sqlite3";

import { logger } from "../logger";
import { config } from "../config";

let sqlite3Instance = sqlite3;

if (config.env === 'development') {
    sqlite3Instance = sqlite3.verbose();
}

// sqlite3.verbose();
export const db = new sqlite3Instance.Database(':memory:', (err) => {
    if (err) {
        logger.error(err.message);
        return;
    }
    logger.debug('Connected to in-memory sqlite db');
});

