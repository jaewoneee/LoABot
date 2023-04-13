import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SOCKET } from "@/config/constants";

interface SocketStoreInterface {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  socketId: string | null;
  connect: () => void;
  disconnect: () => void;
}

const useSocketStore = create<SocketStoreInterface>((set, get) => ({
  socket: null,
  socketId: null,
  connect: () => {
    const socketServer = io(SOCKET, {
      path: "/api/socket",
    });
    socketServer.on("connect", () =>
      set({ socket: socketServer, socketId: socketServer.id })
    );
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, socketId: null });
  },
}));

export default useSocketStore;
