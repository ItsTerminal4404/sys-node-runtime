const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.get('/', (req, res) => {
    res.send('Server status: Operational.');
});

// Universal upgrade handler to hook our connection bridge live
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', (ws) => {
    console.log('Active proxy network bridge established.');
    ws.on('error', console.error);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Wisp server running smoothly on port ${PORT}`);
});
