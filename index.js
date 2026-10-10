const express = require('express');
const { createServer } = require('http');
const wisp = require('wisp-server-node');
const { exec } = require('child_process');

const app = express();
const server = createServer(app);

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

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Wisp protocol server running smoothly on port ${PORT}`);

    // Spin up an unblocked ephemeral Cloudflare tunnel
    exec('npx cloudflared tunnel --url http://localhost:10000', (err, stdout, stderr) => {
        console.log(stdout || stderr);
    });
});
