import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { WebSocketServer } from "ws";

// Simple WebSocket connection handler
function setupWSConnection(conn) {
  console.log("WebSocket connection established");

  conn.on("message", (message) => {
    // Echo the message to all connected clients
    console.log("Received message:", message.toString());
    // For now, just echo back
    conn.send(message);
  });

  conn.on("close", () => {
    console.log("WebSocket connection closed");
  });
}

const PORT = process.env.PORT || 3030;
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// AI stub endpoint
app.post("/ai/run", (req, res) => {
  const { tool, filePath, prompt } = req.body || {};
  res.json({
    result: `AI tool '${tool}' executed on ${filePath || "project"}: ${prompt || ""}`,
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    setupWSConnection(ws);
  });
});

// Error handling
app.use((err, _req, res) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(
    `[api] listening on http://localhost:${PORT} (WS upgrade enabled)`
  );
});
