import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils.js";

const PORT = process.env.PORT || 3030;
const app = express();
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    setupWSConnection(ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT} (WS upgrade enabled)`);
});
