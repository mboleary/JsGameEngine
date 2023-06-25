/**
 * Sets up the in-memory database
 */

import sqlite3 from "sqlite3";

import { logger } from "../logger";

// sqlite3.verbose();
export const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        logger.error(err.message);
        return;
    }
    logger.debug('Connected to in-memory sqlite db');
});