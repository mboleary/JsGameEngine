/**
 * HTTP API for Server
 */

const express = require('express');
const app = express();

express.json();

app.get('/api/rooms', function(req, res) {
    res.json({
        test: true
    });
});

app.get('/api/rooms/:id', function(req, res) {
    res.json({
        test: true
    });
});

app.post('/api/rooms', function(req, res) {
    res.json({
        test: true
    });
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