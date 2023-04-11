import { MessageType, PrivateRoomType } from "@/types";
import { create } from "zustand";

interface PrivateMessage extends PrivateRoomType {
  msg: string;
}

interface ChatStoreInterface {
  chat: MessageType[] | [];
  privateChat: PrivateMessage[] | [];
  privateRoom: PrivateRoomType | null;
  setPrivateRoom: (room: PrivateRoomType) => void;
  setChatList: (newChat: MessageType | PrivateMessage) => void;
}

const useChatStore = create<ChatStoreInterface>((set, get) => ({
  chat: [],
  privateChat: [],
  privateRoom: null,
  setPrivateRoom: (privateRoom) => set({ privateRoom }),
  setChatList: (newChat) => {
    if ("id" in newChat) {
      set({ chat: [...get().chat, newChat] });
    } else if ("host" in newChat) {
      set({ privateChat: [...get().privateChat, newChat] });
    }
  },
}));

export default useChatStore;
