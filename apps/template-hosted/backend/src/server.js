import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 8080);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    app: "template-hosted",
    version: "0.1.0",
    time: new Date().toISOString()
  });
});

const server = http.createServer(app);

// WS endpoint: /ws
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "hello", message: "ws connected" }));

  socket.on("message", (buf) => {
    // ⚠️ 不要打印 token 到日志
    let msg;
    try {
      msg = JSON.parse(buf.toString());
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "invalid json" }));
      return;
    }

    if (msg.type === "IAMMETER_CONFIG") {
      const payload = msg.payload || {};
      // 只回显非敏感字段示例
      socket.send(
        JSON.stringify({
          type: "config_received",
          sn: payload.sn || null,
          mock: !!payload.mock
        })
      );

      // TODO: 这里接入 MQTT 或 IAMMETER API 后，把实时数据推送给前端
      // socket.send(JSON.stringify({type:"data", ...}))
      return;
    }

    socket.send(JSON.stringify({ type: "echo", data: msg }));
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`backend listening on http://0.0.0.0:${PORT}`);
});