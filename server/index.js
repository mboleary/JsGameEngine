/**
 * PubSub Component
 */

console.log(process.env.PORT);

const PORT = process.env.PORT || 8001;

const http = require('http');

const app = require('./http');
const initWebsocket = require('./wshandler');

const server = http.createServer();

server.on('request', app);

initWebsocket(server);

server.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})