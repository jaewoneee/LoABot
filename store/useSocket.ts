import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface SocketStoreInterface {
  socket: null | Socket<DefaultEventsMap, DefaultEventsMap>;
  connect: () => void;
  disconnect: () => void;
}

const useSocketStore = create<SocketStoreInterface>((set, get) => ({
  socket: null,
  connect: () => {
    const socketServer = io("http://localhost:3000", {
      path: "/api/socket",
    });
    set({ socket: socketServer });
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));

export default useSocketStore;
