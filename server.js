const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 9000; 
wss.on('connection', (ws, req) => {
  const location = url.parse(req.url, true);
  if (location.pathname === '/iot/1234') {
    ws.on('message', (message) => {

      const str = String(message).trim(); // ST,GS,+    0.0kg
      const match = str.match(/[-+]?\d*\.?\d+(?=kg)/);// 0.0
      // console.log(`raw: ${String(message)},       Convert: ${match}`);
      console.log(String(match));
      console.log(location.pathname)
      ws.send(String(match))
    });
    
  }
});

server.listen(port, () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

