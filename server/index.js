/**
 * PubSub Component
 */

const WebSocket = require('ws');

function noop() { }

function heartbeat() {
    this.isAlive = true;
}

const wss = new WebSocket.Server({ port: 8001 });

wss.on('connection', function connection(ws, req) {
    console.log("Connection:", req.socket.remoteAddress);
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', (msg) => {
        console.log("Message:", msg);
        if (!msg) return;
        let json = null;
        try {
            json = JSON.parse(msg);
        } catch (e) {
            ws.send("{err: \"Not Valid JSON\"");
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