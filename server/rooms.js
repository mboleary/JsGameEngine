/**
 * Handles storing and managing rooms. @TODO integrate SQL connections here
 */

const {v5: uuid} = require('uuid');

const rooms = [];
const roomsByName = {};
const roomsByID = {};

function getRooms() {
    return rooms;
}

function createRoom(opts) {
    if (roomsByName[opts.name]) {
        throw new Error("Room already created!");
    }

    const toAdd = {
        id: uuid(),
        name: opts.name || "",
        gameObjects: [],
        users: 0,
        limit: opts.limit || 20
    };

    rooms.push(toAdd);
    roomsByName[opts.name] = toAdd;
    roomsByID[toAdd.id] = toAdd;
}

// function updateGameObject

module.exports = {
    getRooms,
    createRoom
}