const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// เก็บ Client ที่เชื่อมต่ออยู่ในลิสต์
const clients = [];

wss.on('connection', (ws, req) => {
  // เพิ่ม Client ที่เชื่อมต่อในลิสต์
  clients.push(ws);

  // เมื่อ Client ปิดการเชื่อมต่อ ให้ลบ Client ออกจากลิสต์
  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  const location = url.parse(req.url, true);
  if (location.pathname === '/iot/1234') {
    ws.on('message', (message) => {
      const str = String(message).trim(); // ST,GS,+    0.0kg
      const match = str.match(/[-+]?\d*\.?\d+(?=kg)/); // 0.0

      console.log(String(message));

      // ส่งข้อความไปยัง Client อื่นที่เชื่อมต่อ
      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(String(match)); // ส่งข้อความไปยัง Client อื่น
        }
      });
    });
  }
});

server.listen(9000, () => {
  console.log('Server is running on http://0.0.0.0:9000');
});
