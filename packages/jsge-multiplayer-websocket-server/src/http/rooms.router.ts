/**
 * Handler for the rooms endpoints
 */

import express from "express";
import { models } from "../db";

const router = express.Router();

router.get('/', async (req, res) => {
    const data = await models.get('room')?.findMany({});
    res.send(data);
});
router.get('/:id', async (req, res) => {
    const data = await models.get('room')?.findMany({uuid: req.params.id});
    res.send(data);
});
router.post('/', async (req, res) => {});
router.put('/:id', async (req, res) => {});
router.delete('/:id', async (req, res) => {});

export default router;