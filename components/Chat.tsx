import { ChangeEvent, useEffect, useRef, useState } from "react";
import useSocketStore from "@/store/useSocket";
import { PROFILE } from "@/config/constants";
import Tool from "./Tool";
import { PrivateMessage, PrivateRoomType } from "@/types";
import styles from "./Chat.module.css";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import { useRouter } from "next/router";
import { scrollToBottom } from "@/utils/scrollEvent";
import useChatStore from "@/store/useChat";
import Default from "./chat/Default";
import Private from "./chat/Private";
import InputBox from "./chat/InputBox";
import Modal from "./common/Modal";
import useModalStore from "@/store/useModal";
import { PrivateRoom, PublicRoom } from "@/types/chat";

function Chat() {
  const router = useRouter();
  const { query } = router;
  const { socket, socketId } = useSocketStore();
  const { isOpened, openModal } = useModalStore();
  const [msg, setMsg] = useState<string>("");
  const [isSearching, setSearching] = useState(false);
  const [isToolOpened, setToolOpened] = useState(false);
  const {
    chat,
    nickname,
    privateChat,
    privateRoom,
    setPrivateRoom,
    setChatList,
    resetPrivateChat,
  } = useChatStore();
  const bottom = useRef<HTMLDivElement>(null);

  const leaveChatRoom = () => {
    router.replace("/");
    socket?.emit(PrivateRoom.EXIT, privateRoom, { id: socketId, nickname });
    setPrivateRoom(null);
    resetPrivateChat();
  };

  useEffect(() => {
    // event listener
    socket?.on(PublicRoom.MSG, (message) => {
      setChatList(message);
    });

    socket?.on(PrivateRoom.SUCCESS, (data: PrivateRoomType) => {
      setPrivateRoom(data);
      router.push(`?id=${data?.chatRoom}`);
    });

    socket?.on(PrivateRoom.RECEIVE, (data: PrivateMessage) => {
      setChatList(data);
    });

    socket?.on(PrivateRoom.NOTICE, (data) => {
      setChatList(data);
    });
  }, [socket]);

  useEffect(() => {
    if (isSearching) {
      setChatList({ id: socketId as string });
    }
    setMsg("");
  }, [isSearching]);

  useEffect(() => {
    scrollToBottom(bottom);
  }, [bottom, chat, privateChat]);

  return (
    <div className={styles["chat-container"]}>
      {isOpened && <Modal />}
      {socketId && (
        <div className={styles["info-box"]}>
          {"id" in query && (
            <button aria-label="채팅방 나가기" onClick={leaveChatRoom}>
              <ArrowBackIosRoundedIcon />
            </button>
          )}
          <div className={styles.nickname}>
            <Image
              src="/profile.png"
              width={50}
              height={50}
              alt="profile-image"
            />
            <div className={styles.nickname}>
              <span>{nickname}</span>
              <button
                aria-label="change nickname"
                onClick={() => openModal("nickname")}
              >
                <EditIcon />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.container}>
        {"id" in query ? <Private /> : <Default />}
        <div ref={bottom} />
      </div>

      {"id" in query === false && isToolOpened && (
        <Tool
          props={{
            isSearching,
            setSearching,
            setToolOpened,
          }}
        />
      )}

      <InputBox
        props={{ msg, setMsg, setToolOpened, setSearching, isSearching }}
      />
    </div>
  );
}

export default Chat;
