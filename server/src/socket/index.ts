import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { PING_INTERVAL, PING_TIMEOUT } from "./constants";
import mixpanel from "../mixpanel";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";
import { roomHandler } from "../handler/roomHandler";
import logger from "../logging";
import { gameHandler } from "../handler/gameHandler";

export default (server: HTTPServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
    server,
    {
      cors: {
        origin: [
          "http://localhost:3021",
          "http://192.168.1.66:3021",
          "http://172.20.10.3:3021",
        ],
        methods: ["GET", "POST"],
      },
      pingInterval: PING_INTERVAL,
      pingTimeout: PING_TIMEOUT,
    }
  );

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const ip =
      socket.handshake.headers["x-real-ip"] ||
      socket.handshake.headers["x-forwarded-for"];
    socket.data.userId = userId;
    socket.data.ip = ip;
    return next();
  });

  io.on("connection", (socket) => {
    logger.info(
      `[USER ${socket.data.userId}] User connected with socket Id ${socket.id}`
    );
    mixpanel.userConnect(socket.data.userId, socket.data.ip);

    roomHandler(io, socket);
    gameHandler(io, socket);

    socket.on("disconnect", async () => {
      logger.info(`[USER ${socket.data.userId}] User disconnected`);
    });
  });
  return io;
};
