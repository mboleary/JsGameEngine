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

function getRoom(id) {
    return roomsByID[id];
}

function createRoom(opts) {
    if (roomsByName[opts.name]) {
        throw new Error("Room already created!");
    }

    const toAdd = {
        id: uuid(),
        name: opts.name || "",
        gameObjects: [],
        users: [],
        limit: opts.limit || 20,
        private: opts.private || false,
    };

    rooms.push(toAdd);
    roomsByName[opts.name] = toAdd;
    roomsByID[toAdd.id] = toAdd;
}

function addUser(roomID, userObj) {
    if (!roomsByID[roomID]) {
        throw new Error("Invalid Room ID!");
    }

    const room  = roomsByID[roomID];
    room.users.push({
        id: uuid(),
        ipAddr: userObj.ipAddr || "",
        port: userObj.port || "",

    })
}

/**
 * Updates some properties of a room. Includes things like the room name, private / public, etc.
 * @param {*} id ID of room to update
 * @param {*} opts Options
 */
function updateRoom(id, opts) {

}

// function updateGameObject

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    addUser
}