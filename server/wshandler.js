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
        Rooms.addClient(args.room.id, {
            ws: ws,
            ipAddr: req.socket.remoteAddress,
            port: req.socket.remotePort,
            name: args.name
        })
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
                doesBroadcast = true;
                // @TODO check update number
                Rooms.createOrUpdateGameObject(args.room.id, json.data);
            }

            if (json.action === "get") {
                if (json.target === SERVER_TARGET) {
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
                    room.clients.forEach((client) => {
                        if (client.id === json.target) {
                            client.ws.send(JSON.stringify(json));
                        }
                    })
                }
            }
        });
        ws.send('TEST');
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