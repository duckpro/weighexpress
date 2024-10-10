const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const url = require('url');

// สร้าง Express app และ WebSocket server บนพอร์ต 9000
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 9000;

// สร้าง WebSocket client ที่เชื่อมต่อกับ WebSocket server ที่รันบน localhost:3060
const wsClient = new WebSocket('ws://localhost:3060/weighting');

wss.on('connection', (ws, req) => {
  const location = url.parse(req.url, true);
  if (location.pathname === '/iot/1234') {
    ws.on('message', (message) => {
      const str = String(message).trim(); // แปลง message เป็น string
      const match = str.match(/[-+]?\d*\.?\d+(?=kg)/); // แยกค่าตัวเลขที่ตรงกับ pattern kg

      console.log(`Received and matched data: ${String(match)}`);

      // ส่งข้อมูลไปยัง WebSocket client ที่รันบน localhost:3060
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(String(match)); // ส่งข้อมูลไปยัง client
        console.log('Sent data to client at localhost:3060:', String(match));
      } else {
        console.log('Connection to localhost:3060 is not open.');
      }

      // ส่งข้อมูลกลับไปยัง client ที่เชื่อมต่อกับ WebSocket server บนพอร์ต 9000
      ws.send(String(match));
    });
  }
});

// จัดการเมื่อเชื่อมต่อ WebSocket client ไปยัง localhost:3060 สำเร็จ
wsClient.on('open', () => {
  console.log('Connected to WebSocket server at localhost:3060');
});

// จัดการข้อผิดพลาด
wsClient.on('error', (error) => {
  console.error('WebSocket connection error:', error);
});

// เริ่มทำงาน WebSocket server บนพอร์ต 9000
server.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
