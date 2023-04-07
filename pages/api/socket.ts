import { PrivateRoomType } from "@/types/index";
/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

interface PrivateMessage extends PrivateRoomType {
  msg: string;
}

export default async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      socket.on("send-message", (msg) => sendMessage(msg));
      socket.on("character", (msg) => {
        sendMessage(msg);
        socket.join(msg?.chatRoom);
      });
      socket.on("chatroom", (msg: PrivateRoomType) => {
        const { chatRoom } = msg;
        socket.join(chatRoom);
        io.to(chatRoom).emit("private", msg);
      });
      socket.on("private-message", (data: PrivateMessage) => {});
    });

    const sendMessage = (msg: any) => {
      io.emit("message", msg);
    };

    const sendMessagePrivately = () => {};
  }
  res.end();
};
