/**
 * HTTP API for Server
 */

const express = require('express');
const app = express();
const cors = require('cors');

const Rooms = require("./rooms");

app.use(express.json());
app.use(cors());

app.get('/api/rooms', function(req, res) {
    console.log("GET rooms");
    try {
        let dataset = Rooms.getRooms();
        res.json({
            length: dataset.length || 0,
            dataset: dataset || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: "room.get_all.err",
            error: "500 - Internal server error:" + err.toString()
        });
    }
});

app.get('/api/rooms/:id', function(req, res) {
    console.log("GET room", req.params);
    try {
        let room = Rooms.getRoom(req.params.id);
        if (!room) {
            res.status(404).json({
                code: "room.get.not_found",
                error: "404 - Room not found"
            });
            return;
        }
        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: "room.get.err",
            error: "500 - Internal server error:" + err.toString()
        });
    }
});

app.post('/api/rooms', function(req, res) {
    try {
        console.log("POST rooms", req.body);
        if (!req.body) {
            console.log("Returning 400 - no body");
            res.status(400).json({
                code: "room.post.no_body",
                error: "400 - No Body"
            });
            return;
        }
        let toRet = Rooms.createRoom(req.body);
        res.json(toRet);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: "room.post.err",
            error: "500 - Internal server error:" + err.toString()
        });
    }
});

app.put('/api/rooms/:id', function(req, res) {
    console.log("PUT rooms");
    res.json({
        test: true
    });
});

app.delete('/api/rooms/:id', function(req, res) {
    console.log("DELETE rooms");
    res.json({
        test: true
    });
});

module.exports = app;