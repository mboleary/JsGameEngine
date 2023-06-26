/**
 * Handler for the rooms endpoints
 */

import express from "express";
import { models } from "../db";
import { HTTPError } from "./framework/errors/http.error";
import { logger } from "../logger";
import { config } from "../config";
import { HTTPNotFoundError } from "./framework/errors/notFound.error";

const router = express.Router();

router.get('/:id', async (req, res) => {
    if (config.env === "development") {
        logger.debug(`[${req.method}] ${req.path} ${req.params}`);
    }
    try {
        const data = await models.get('room')?.findOne({uuid: req.params.id});
        if (!data) {
            throw new HTTPNotFoundError("Room could not be found", "room.get_one.not_found");
        }
        res.json(data);
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.httpCode >= 500) {
                logger.error(`HTTP Error ${req.path} ${
                    JSON.stringify(error)
                }`);
            } else if (config.env === "development") {
                logger.warn(`HTTP Error caught ${req.path} ${JSON.stringify(error)}`);
            }
            res.status(error.httpCode).json({
                httpCode: error.httpCode,
                code: error.code,
                message: error.message,
                trace: config.env === "development" ? error.stack : undefined,
                error: config.env === "development" ? JSON.stringify(error) : undefined
            });
            return;
        } 
        logger.error(`Uncaught error ${req.path} ${
            JSON.stringify(error)
        }`);
        res.status(500).json({
            httpCode: 500,
            code: "Internal server error",
            error: config.env === "development" ? JSON.stringify(error) : undefined
        });
        return;
    }
    
});

router.get('/', async (req, res) => {
    const data = await models.get('room')?.findMany({});
    res.json(data);
});

router.post('/', async (req, res) => {});
router.put('/:id', async (req, res) => {});
router.delete('/:id', async (req, res) => {});

export default router;