const express = require('express');
const { createServer } = require('http');
const wisp = require('@mercuryworkshop/wisp-js');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Server status: Operational.');
});

server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.destroy();
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Wisp server running smoothly on port ${PORT}`);
});
