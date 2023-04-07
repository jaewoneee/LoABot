/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export default async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      socket.on("send-message", (msg) => sendMessage(msg));
      socket.on("character", (msg) => sendMessage(msg));
      socket.on("chatroom", (msg) => sendMessage(msg));
    });

    const sendMessage = (msg: any) => {
      io.emit("message", msg);
    };
  }
  res.end();
};
