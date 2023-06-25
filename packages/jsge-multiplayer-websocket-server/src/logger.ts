/**
 * Configures logging
 */

import winston from "winston";
import { config } from "./config";

export const logger = winston.createLogger({
    level: config.logLevel, // @TODO add config option for this
    format: winston.format.json(),
    defaultMeta: {service: 'jsge-multiplayer-websocket-server'},
    transports: [
        // @TODO explore how to customize this with environment configs
        new winston.transports.File({ filename: 'log.txt' })
    ]
});

// @TODO change for configuration
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
}