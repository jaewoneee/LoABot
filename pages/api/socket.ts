/* eslint-disable import/no-anonymous-default-export */
import { PrivateMessage, PrivateRoomType } from "@/types/index";
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
      socket.on("send-message", (msg) => {
        sendMessage(msg);
      });
      socket.on("character", (msg) => {
        sendMessage(msg);
        socket.join(msg?.chatRoom);
      });
      socket.on("enter-chatroom", (data: PrivateRoomType) => {
        const { chatRoom } = data;
        socket.join(chatRoom);
        io.to(chatRoom).emit("private", data);
      });
      socket.on("send-private-message", (data: PrivateMessage) => {
        const { chatRoom } = data;
        io.to(chatRoom).emit("receive-private-message", data);
      });
      socket.on("exit-chatroom", (data: PrivateRoomType, id: string) => {
        const { chatRoom } = data;
        socket.leave(data.chatRoom);
        io.to(chatRoom).emit("leave-message", { ...data, leave: id });
      });
    });

    const sendMessage = (msg: any) => {
      io.emit("message", msg);
    };
  }
  res.end();
};
