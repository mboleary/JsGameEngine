/**
 * Websocket Handler
 */

function connection(ws, req) {
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
}

module.exports = connection;