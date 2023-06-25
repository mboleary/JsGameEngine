/**
 * Model for controlling rooms in the database
 */

import { v4 as uuidv4 } from "uuid";

import { logger } from "../../logger";
import { db } from "../db";
import { Room } from "../entity/Room";
import { DBModel } from "../orm/model";

export class RoomsModel extends DBModel<Room> {
    init(): Promise<void> {
        return new Promise((res, rej) => {
            db.run(`CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY,
                uuid TEXT NOT NULL,
                private INTEGER,
                name TEXT NOT NULL,
                code TEXT NOT NULL,
                limit INTEGER,
                open INTEGER
            );
            CREATE UNIQUE INDEX idx_rooms_uuid ON rooms (uuid);`, [], (err) => {
                if (err) {
                    rej(err);
                    return;
                }
                res();
            });
        });
    }
    insert(parameters: Partial<Room>): Promise<Room> {
        return new Promise((res, rej) => {
            const params = Object.assign({}, parameters, {
                uuid: uuidv4(),
                id: undefined,
            });
            db.run(`INSERT INTO rooms (uuid, private, name, code, limit, open) VALUES ?uuid`, [], function (err) {
                if (err) {
                    rej(err);
                    return;
                }
                logger.debug(`Inserted ${this.changes} Row(s), ${this.lastID}`);

                db.all(`SELECT * FROM rooms WHERE id = ? LIMIT 1`, [this.lastID], function (err, rows: Room[]) {
                    if (err) {
                        rej(err);
                        return;
                    }
                    res(rows[0]);
                });
            });
        });
    }
    findOne(whereParameters: Partial<Room>): Promise<Room> {
        return new Promise((res, rej) => {
            const roomKeys: Array<keyof Room> = Object.keys(new Room()).sort() as Array<keyof Room>;
            const whereParamKeys = Object.keys(whereParameters).sort();
            let commonKeys: Array<keyof Room> = [];

            let i = 0, j = 0;
            while (i < roomKeys.length && j < whereParamKeys.length) {
                const cmp = roomKeys[i].localeCompare(whereParamKeys[j]);
                if (cmp === 0) {
                    commonKeys.push(roomKeys[i]);
                    i++;
                    j++;
                } else if (cmp < 0) {
                    i++;
                } else {
                    j++;
                }
            }

            const whereStr = commonKeys.map((val) => `${val} = ?`).join(' AND ');
            const whereVals = commonKeys.map((key: keyof Room) => whereParameters[key])
            db.all(`SELECT * FROM rooms WHERE ${whereStr} LIMIT 1`, whereVals, (err, rows: Room[]) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(rows[0]);
            });
        });
    }
    findMany(whereParameters: Partial<Room>): Promise<Room[]> {
        return new Promise((res, rej) => {
            const roomKeys: Array<keyof Room> = Object.keys(new Room()).sort() as Array<keyof Room>;
            const whereParamKeys = Object.keys(whereParameters).sort();
            let commonKeys: Array<keyof Room> = [];

            let i = 0, j = 0;
            while (i < roomKeys.length && j < whereParamKeys.length) {
                const cmp = roomKeys[i].localeCompare(whereParamKeys[j]);
                if (cmp === 0) {
                    commonKeys.push(roomKeys[i]);
                    i++;
                    j++;
                } else if (cmp < 0) {
                    i++;
                } else {
                    j++;
                }
            }

            const whereStr = commonKeys.map((val) => `${val} = ?`).join(' AND ');
            const whereVals = commonKeys.map((key: keyof Room) => whereParameters[key])
            db.all(`SELECT * FROM rooms WHERE ${whereStr}`, whereVals, (err, rows: Room[]) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(rows);
            });
        });
    }
    updateOne(whereParameters: Partial<Room>, updateParameters: Partial<Room>): Promise<Room> {
        throw new Error("Method not implemented.");
    }
    updateMany(whereParameters: Partial<Room>, updateParameters: Partial<Room>): Promise<Room[]> {
        throw new Error("Method not implemented.");
    }
    deleteOne(whereParameters: Partial<Room>): Promise<Room> {
        throw new Error("Method not implemented.");
    }
    deleteMany(whereParameters: Partial<Room>): Promise<Room[]> {
        throw new Error("Method not implemented.");
    }

}