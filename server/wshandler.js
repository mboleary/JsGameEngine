/**
 * Websocket Handler
 */

const WebSocket = require('ws');
const Layer = require("express/lib/router/layer");

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

        console.log("req.url:", req.url);

        let lyr = Layer("/ws/:id", {},  function a() {});

        let match = lyr.match(req.url);

        let params = lyr.params;

        console.log("Upgrading:", match, params);

        // if (req.url.match(/\/ws\//))


        // if (req.url)

        wss.handleUpgrade(req, sock, head, function(ws) {
            wss.emit("connection", ws, req, args);
        })
    })

    wss.on('connection', function(ws, req, args) {
        console.log("URL:", req.url);
        console.log("Connection:", req.socket.remoteAddress);
        console.log("ARGS:", args);
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
            console.log("Action:", json.action, "Target:", json.target);
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