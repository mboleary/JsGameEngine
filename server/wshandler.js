/**
 * Websocket Handler
 */

const WebSocket = require('ws');
const Layer = require("express/lib/router/layer");

const Rooms = require("./rooms");

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
                ws.send("{err: \"Not Valid JSON\"}");
                return;
            }
            console.log("Message Room:", args.room);
            console.log("Action:", json.action, "Target:", json.target);
            // @TODO Add new Actions, Targets. Make sure that messages are only being sent to room participants
            if (json.action === "update") {
                if (json.target === "*") {
                    wss.clients.forEach((wsr) => {
                        if (wsr !== ws) {
                            wsr.send(JSON.stringify(json));
                        }
                    });

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