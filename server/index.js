/**
 * PubSub Component
 */

console.log(process.env.PORT);

const PORT = process.env.PORT || 8001;

const WebSocket = require('ws');
const http = require('http');

const app = require('./http');
const wshandler = require('./wshandler');

const server = http.createServer();

// Define HTTP Server

server.on('request', app);

// Define Websocket Server

function noop() { }

function heartbeat() {
    this.isAlive = true;
}

const wss = new WebSocket.Server({ server: server });

wss.on('connection', wshandler);

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

server.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})