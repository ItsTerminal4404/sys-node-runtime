const express = require('express');
const { createServer } = require('http');
const { wisp } = require('@mercuryworkshop/wisp-js');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

// Basic health-check route
app.get('/', (req, res) => {
    res.send('Server status: Operational.');
});

// Handle the incoming Wisp WebSocket upgrades
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.destroy();
    }
});

// Old version was: server.listen(PORT, () => {
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Wisp server running smoothly on port ${PORT}`);
});

