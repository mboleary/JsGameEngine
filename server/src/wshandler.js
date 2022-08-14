/**
 * Websocket Handler
 */

const WebSocket = require('ws');
const Layer = require("express/lib/router/layer");

const Rooms = require("./rooms");

const SERVER_TARGET = "server";

function noop() { }

function heartbeat() {
    this.isAlive = true;
}

function getClientIDs(clients) {
    const toRet = [];
    clients.forEach((client) => {
        toRet.push(client.id);
    })
    return toRet;
}

function initWebsocket(server) {
    const wss = new WebSocket.Server({ noServer: true }); //was server: server

    server.on("upgrade", async function(req, sock, head) {
        // Check the URL to join the correct room

        const args = {};

        args.test = "This is a test";

        // URL should be a GET request and look like this: /ws/:room-id

        let lyr = Layer("/ws/:id", {},  function a() {});

        let match = lyr.match(req.url);

        let params = lyr.params;

        // Check for room

        const room = Rooms.getRoom(params.id)

        if (!match || !params.id || !room) {
            console.log("Room not created:", params);
            sock.destroy();
            return;
        }

        args.room = room;

        // Parse URL

        const url = new URL(req.url, `ws://${req.headers.host}`);

        if (url.searchParams) {
            args.name = url.searchParams.name;
        }

        wss.handleUpgrade(req, sock, head, function(ws) {
            wss.emit("connection", ws, req, args);
        })
    })

    wss.on('connection', function(ws, req, args) {
        console.log("URL:", req.url);
        console.log("Connection:", req.socket.remoteAddress, req.socket.remotePort);
        console.log("ARGS:", args);

        // Add the new client to the room
        const newClient = Rooms.addClient(args.room.id, {
            ws: ws,
            ipAddr: req.socket.remoteAddress,
            port: req.socket.remotePort,
            name: args.name
        });

        ws.isAlive = true;
        ws.on('pong', heartbeat);
        ws.on('message', (msg) => {
            console.log("Message:", msg);
            if (!msg) return;
            let json = null;
            try {
                json = JSON.parse(msg);
            } catch (e) {
                ws.send(JSON.stringify({err: "Not valid JSON"}));
                return;
            }
            console.log("Message Room:", args.room);
            console.log("Action:", json.action, "Target:", json.target);

            if (!json.action || !json.target) {
                console.log("Malformed request:", json);
                ws.send(JSON.stringify({err: "Not a valid request"}));
                return;
            }

            let doesBroadcast = false; // Send to clients if true

            // @TODO Add new Actions, Targets. Make sure that messages are only being sent to room participants
            if (json.action === "create" || json.action === "update") {
                // Check ownership
                let room = Rooms.getRoom(args.room.id);
                for (const go of room.gameObjects) {
                    if (go.id === json.id) {
                        if (go.owner !== newClient.id) {
                            // Not owned by this client. Send an error
                            ws.send(JSON.stringify({
                                code: 403,
                                err: "Forbidden - Owned by a different client!"
                            }));
                            return;
                        }
                        break;
                    }
                }
                doesBroadcast = true;
                // @TODO check update number
                Rooms.createOrUpdateGameObject(args.room.id, json.id, json.data, newClient.id);
            }

            if (json.action === "get") {
                if (json.target === SERVER_TARGET) {
                    // Get GameObject from cache
                    let room = Rooms.getRoom(args.room.id);
                    for (const go of room.gameObjects) {
                        if (go.id === json.data.id) {
                            ws.send(go);
                            return;
                        }
                    }
                } else {
                    doesBroadcast = true;
                }
            }

            if (json.action === "delete") {
                doesBroadcast = true;
                Rooms.deleteGameObject(args.room.id, json.data.id);
            }

            if (json.action === "message") {
                if (json.target === SERVER_TARGET) {
                    // This is for PubSub Server administration
                    console.log("Placeholder for server command:", json.data);
                    ws.send(JSON.stringify({success: true}));
                    return;
                } else {
                    // Send a message directly to a client
                    doesBroadcast = true;
                }
            }

            if (doesBroadcast) {
                let room = Rooms.getRoom(args.room.id);
                // Figure out the target
                if (json.target === "*") {
                    // All connected clients in room
                    // wss.clients.forEach((wsr) => {
                    //     if (wsr !== ws) {
                    //         wsr.send(JSON.stringify(json));
                    //     }
                    // });
                    room.clients.forEach((client) => {
                        if (client.ws !== ws) {
                            client.ws.send(JSON.stringify(json));
                        }
                    })
                } else {
                    // Send to a specific target
                    for (const client of room.clients) {
                        if (client.id === json.target) {
                            client.ws.send(JSON.stringify(json));
                            return;
                        }
                    }
                }
            }
        });
        ws.on('close', (code, reason) => {
            console.log("Connection Closed:", code, reason);
            // Remove the client from the room
            Rooms.deleteClient(args.room.id, newClient.id);
            // Broadcast the leave event
            args.room.clients.forEach((client) => {
                if (client.ws !== ws) {
                    const json = {
                        event: "leave",
                        data: newClient.id
                    }
                    client.ws.send(JSON.stringify(json));
                }
            });
            // Remove the GameObjects that the client used to own
            for (let i = 0; i < args.room.gameObjects.length; i++) {
                if (args.room.gameObjects[i].owner === newClient.id) {
                    // This GameObject should be deleted
                    const go = args.room.gameObjects[i];
                    console.log("Deleting GameObject:", go.id);
                    args.room.gameObjects.splice(i, 1);
                    i--;

                    // Broadcast the removal message
                    args.room.clients.forEach((client) => {
                        if (client.ws !== ws) {
                            const json = {
                                event: "delete",
                                target: "*",
                                id: go.id,
                                data: null
                                // @TODO Add update number
                            }
                            client.ws.send(JSON.stringify(json));
                        }
                    });
                }
            }
        })

        
        let toSend = Object.assign({}, newClient);
        toSend.ws = undefined; // Remove websocket from payload we're going to send back

        // Broadcast a join message to all clients in the room except the one joining
        args.room.clients.forEach((client) => {
            if (client.ws !== ws) {
                const json = {
                    event: "join",
                    data: toSend
                }
                client.ws.send(JSON.stringify(json));
            }
        });

        // Send the init message to the newly-joined client
        ws.send(JSON.stringify({
            event: "init",
            data: {
                clientInfo: newClient.id,
                clients: getClientIDs(args.room.clients),
                gameObjects: args.room.gameObjects
            }
        }));
    });

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 30000);

    wss.on('close', function close() {
        clearInterval(interval);
    });

}

module.exports = initWebsocket;