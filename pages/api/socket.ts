/* eslint-disable import/no-anonymous-default-export */
import { PrivateMessage, PrivateRoomType } from "@/types/index";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { PrivateRoom, PublicRoom, LostArk } from "@/types/chat";

export default async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });

    const sendMessage = (msg: any) => {
      io.emit(PublicRoom.MSG, msg);
    };

    io.on("connection", (socket) => {
      // 메시지 보내기
      socket.on(PublicRoom.SEND, (msg) => {
        sendMessage(msg);
      });
      // 캐릭터 공유하기
      socket.on(LostArk.CHA, (msg) => {
        sendMessage(msg);
        socket.join(msg?.chatRoom);
      });
      // 일대일 채팅방 입장하기
      socket.on(PrivateRoom.ENTER, (data: PrivateRoomType) => {
        const { chatRoom } = data;
        socket.join(chatRoom);
        io.to(chatRoom).emit(PrivateRoom.SUCCESS, data);
      });
      // 일대일 채팅방 메시지 보내기
      socket.on(PrivateRoom.SEND, (data: PrivateMessage) => {
        const { chatRoom } = data;
        io.to(chatRoom).emit(PrivateRoom.RECEIVE, data);
      });
      // 일대일 채팅방 나가기
      socket.on(
        PrivateRoom.EXIT,
        (data: PrivateRoomType, leave: { id: string; nickname: string }) => {
          const { chatRoom } = data;
          socket.leave(data.chatRoom);
          io.to(chatRoom).emit(PrivateRoom.NOTICE, { ...data, leave });
        }
      );
    });
  }
  res.end();
};
