/**
 * Handler for the rooms endpoints
 */

import { Room, models } from "../db";
import { HTTPNotFoundError } from "./framework/errors/notFound.error";
import { HTTP_METHODS } from "./framework/types/httpMethods.enum";
import { Route, Router, Param, Body } from "./framework/decorators/router";
import { v4 as uuidv4 } from "uuid";

@Router("/rooms")
export class RoomsRouter {

    @Route(HTTP_METHODS.GET, "/:id")
    async getOne(
        @Param('id') id: string,
    ): Promise<Room> {
        const data = await models.get('room')?.findOne({uuid: id});
        if (!data) {
            throw new HTTPNotFoundError("Room could not be found", "room.get_one.not_found");
        }
        return data;
    }

    @Route(HTTP_METHODS.GET, "/")
    async getAll(): Promise<Room[]> {
        const data = await models.get('room')?.findMany({});
        return data || [];
    }

    @Route(HTTP_METHODS.POST, "/")
    async create(
        @Body() body: Room
    ): Promise<Room> {
        const data = await models.get('room')?.insert({
            ...body,
            uuid: uuidv4(),
        });
        return data;
    }

    @Route(HTTP_METHODS.PUT, "/:id")
    async update(
        @Body() body: Partial<Room>,
        @Param('id') id: string,
    ): Promise<Room> {
        const data = await models.get('room')?.updateOne({uuid: id}, body);
        return data;
    }

    @Route(HTTP_METHODS.DELETE, "/:id")
    async delete(
        @Param('id') id: string,
    ): Promise<Room> {
        const data = await models.get('room')?.deleteOne({uuid: id});
        return data;
    }
}