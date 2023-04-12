import { MessageType, PrivateMessage, PrivateRoomType } from "@/types";
import { create } from "zustand";

interface ChatStoreInterface {
  chat: MessageType[] | [];
  privateChat: PrivateMessage[] | [];
  privateRoom: PrivateRoomType | null;
  setPrivateRoom: (room: PrivateRoomType | null) => void;
  setChatList: (newChat: MessageType | PrivateMessage) => void;
  resetPrivateChat: () => void;
}

const useChatStore = create<ChatStoreInterface>((set, get) => ({
  chat: [],
  privateChat: [],
  privateRoom: null,
  setPrivateRoom: (privateRoom) => set({ privateRoom }),
  setChatList: (newChat) => {
    if ("id" in newChat || "news" in newChat) {
      set({ chat: [...get().chat, newChat] });
    } else if ("host" in newChat) {
      set({ privateChat: [...get().privateChat, newChat] });
    }
  },
  resetPrivateChat: () => set({ privateChat: [] }),
}));

export default useChatStore;
