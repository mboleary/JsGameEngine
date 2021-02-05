/**
 * Handles storing and managing rooms. @TODO integrate SQL connections here
 */

const {v4: uuid} = require('uuid');

const rooms = [];
const roomsByName = {};
const roomsByID = {};

function getRooms() {
    let toRet = [];
    rooms.forEach((room) => {
        if (!room.private) {
            toRet.push(room);
        }
    });
    return toRet;
}

function getRoom(id) {
    return roomsByID[id];
}

function getRoomsByName(name) {
    let toRet = [];
    roomsByName[name].forEach((room) => {
        if (!room.private) {
            toRet.push(room);
        }
    });
    return toRet;
}

function createRoom(opts) {
    if (roomsByName[opts.name]) {
        throw new Error("Room already created!");
    }

    const toAdd = {
        id: uuid(),
        name: opts.name || "",
        gameObjects: [],
        clients: [],
        limit: opts.limit || 20,
        private: opts.private || false,
    };

    rooms.push(toAdd);
    roomsByID[toAdd.id] = toAdd;

    if (!roomsByName[opts.name]) {
        roomsByName[opts.name] = [];
    }
    roomsByName[opts.name].push(toAdd);

    return toAdd;
}

function addClient(roomID, clientObj) {
    if (!roomsByID[roomID]) {
        throw new Error("Invalid Room ID!");
    }

    const room  = roomsByID[roomID];
    room.clients.push({
        id: uuid(),
        ipAddr: clientObj.ipAddr || "",
        port: clientObj.port || "",
        name: clientObj.name || "",
        ws: clientObj.ws,
    })
}

/**
 * Updates some properties of a room. Includes things like the room name, private / public, etc.
 * @param {*} id ID of room to update
 * @param {*} opts Options
 */
function updateRoom(id, opts) {
    let room = roomsByID[id];

    if (!room) {
        throw new Error("Room not found");
    }

    const blacklist = ["id", "gameObjects", "clients"];
    for (const key of Object.keys(opts)) {
        if (blacklist.indexOf(key) === -1) {
            room[key] = opts[key];
        }
    }
}

/**
 * Creates or Updates a GameObject
 * @param {String} id Room ID
 * @param {Object} gameObject New GameObject Data
 * @param {Object} owner Owner of the G.O.
 */
function createOrUpdateGameObject(id, gameObject, owner) {
    let room = roomsByID[id];

    if (!room) {
        throw new Error("Room not found");
    }

    let found = false;
    for (let i = 0; i < room.gameObjects.length; i++) {
        if (room.gameObjects[i].id === id) {
            room.gameObjects[i].data = gameObject;
            room.gameObjects[i].owner = owner;
            found = true;
            break;
        }
    }
    if (!found) {
        room.gameObjects.push({
            owner: owner || null,
            data: gameObject
        });
    }
}

// Deletes a GameObject from a room
function deleteGameObject(roomID, goID) {
    let room = roomsByID[roomID];

    if (!room) {
        throw new Error("Room not found");
    }

    let found = false;
    for (let i = 0; i < room.gameObjects.length; i++) {
        if (room.gameObjects[i].id === goID) {
            room.gameObjects[i].splice(i, 1);
            found = true;
            break;
        }
    }
    if (!found) {
        throw new Error("GameObject Not Found");
    }
}

function deleteRoom(id) {
    let room = roomsByID[id];

    if (!room) {
        throw new Error("Room not found");
    }

    delete roomsByID[id];

    let byName = roomsByName[room.name];
    if (byName && byName.length > 0) {
        for (let i = 0; i < byName.length; i++) {
            if (byName[i].id === id) {
                byName.splice(i, 1);
                break;
            }
        }
    }

    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id === id) {
            rooms.splice(i, 1);
            break;
        }
    }
}

module.exports = {
    getRooms,
    getRoom,
    getRoomsByName,
    createRoom,
    addClient,
    updateRoom,
    createOrUpdateGameObject,
    deleteGameObject,
    deleteRoom
}