/**
 * HTTP API for Server
 */

const express = require('express');
const app = express();

const Rooms = require("./rooms");

express.json();

app.get('/api/rooms', function(req, res) {
    let dataset = Rooms.getRooms();
    res.json({
        length: dataset.length || 0,
        dataset: dataset || []
    });
});

app.get('/api/rooms/:id', function(req, res) {
    let room = Rooms.getRoom(req.params.id);
    if (!room) {
        res.status(404).json({
            code: "room.not_found",
            error: "404 - Room not found"
        });
        return;
    }
    res.json(room);
});

app.post('/api/rooms', function(req, res) {
    if (!req.body) {
        res.status(400).json({
            code: "room.no_body",
            error: "400 - No Body"
        });
        return;
    }
    let toRet = Rooms.createRoom(req.body);
    res.json(toRet);
});

app.put('/api/rooms', function(req, res) {
    res.json({
        test: true
    });
});

app.delete('/api/rooms', function(req, res) {
    res.json({
        test: true
    });
});

module.exports = app;