const express = require('express');
const { createServer } = require('http');
const wisp = require('wisp-server-node');

const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
    res.send('Server status: Operational.');
});

// Intercept the browser upgrade request and process the Wisp handshake
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.destroy();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Wisp protocol server running smoothly on port ${PORT}`);
});
// Add this right inside your server.listen loop callback block:
require('child_process').exec('npx @cloudflare/cloudflared tunnel --url http://localhost:10000', (err, stdout) => {
    if (stdout) console.log(stdout.match(/https:\/\/.*\.trycloudflare\.com/)?.[0]);
});
