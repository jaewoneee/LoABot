import { create } from "zustand";

interface ChatStoreInterface {
  type: string | null;
  isOpened: boolean;
  openModal: (type: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ChatStoreInterface>((set, get) => ({
  type: null,
  isOpened: false,
  openModal: (type: string) => {
    set({ isOpened: true, type });
  },
  closeModal: () => {
    set({ isOpened: false, type: null });
  },
}));

export default useModalStore;
