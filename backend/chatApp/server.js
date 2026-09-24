import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading index.html');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

function broadcast(data, excludeSocket = null) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== excludeSocket && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, 'http://localhost').searchParams.get('username');

  broadcast({
    type: 'system',
    text: `${username} joined`
  });

  socket.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      broadcast({
        type: 'chat',
        username: parsed.username,
        text: parsed.text
      });
    } catch (err) {
      console.error('Invalid message format:', err);
    }
  });

  socket.on('close', () => {
    broadcast({
      type: 'system',
      text: `${username} left`
    }, socket);
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});