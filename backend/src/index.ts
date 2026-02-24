import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer } from "ws";
import type { Server } from "http";
import { handleConnection } from "./ws/handler.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

const server = serve({ fetch: app.fetch, port: 3000 });
const wss = new WebSocketServer({ server: server as unknown as Server });

wss.on("connection", handleConnection);

console.log("Server running on http://localhost:3000");
