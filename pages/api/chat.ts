/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: any) {
  const { msg, id, data, shared, chatRoom } = req.body;

  if (chatRoom) {
    const { io } = res?.socket?.server;
    io.on("join-personal-room", () => {
      io.join(chatRoom); // 해당 방에 클라이언트 참여
      console.log(`${id}가 ${chatRoom} 방에 참여했습니다.`);

      // 해당 방으로 메시지를 보낼 때는 io.to(roomName).emit('event-name', data)를 사용합니다.
      io.emit("personal-chat-message", "개인 채팅방에 참여했습니다.");
    });
  } else {
    // res?.socket?.server?.io?.emit("message", { id, msg, data, shared });
    // res?.socket?.server.io.on("send-message", (message: any) => {
    //   console.log("data", message);
    // });
    // res?.socket?.server.io.on("connection", (socket: any) => {
    //   socket.on("send-message", (message: any) => {
    //     console.log("data", message);
    //   });
    //   socket.emit("return-message", "gmlglm");
    // });
  }

  res.status(201).json(req.body);
}
