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

function Chat() {
  const router = useRouter();
  const { query } = router;
  const { socket, socketId } = useSocketStore();
  const [msg, setMsg] = useState<string>("");
  const [nicknameValue, setNicknamevalue] = useState<string>("");
  const [isSearching, setSearching] = useState(false);
  const [isOpened, setOpened] = useState(false);
  const [isChanging, setChanging] = useState(false);
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

  const changeNickname = () => {
    localStorage.setItem("nickname", nicknameValue);
  };

  const handleChangeNickname = () => {};

  const leaveChatRoom = () => {
    router.replace("/");
    socket?.emit("exit  -chatroom", privateRoom, socketId);
    setPrivateRoom(null);
    resetPrivateChat();
  };

  useEffect(() => {
    // event listener
    socket?.on("message", (message) => {
      setChatList(message);
    });

    socket?.on("private", (data: PrivateRoomType) => {
      setPrivateRoom(data);
      router.push(`?id=${data?.chatRoom}`);
    });

    socket?.on("receive-private-message", (data: PrivateMessage) => {
      setChatList(data);
    });

    socket?.on("leave-message", (data) => {
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
    const timer = setTimeout(() => {
      scrollToBottom(bottom);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [chat, privateChat]);

  return (
    <div className={styles["chat-container"]}>
      {socketId && (
        <div className={styles["info-box"]}>
          {"id" in query && (
            <button aria-label="채팅방 나가기" onClick={leaveChatRoom}>
              <ArrowBackIosRoundedIcon />
            </button>
          )}
          <div
            className={styles.nickname}
            onClick={() => setChanging((state) => !state)}
          >
            <Image
              src="/profile.png"
              width={50}
              height={50}
              alt="profile-image"
            />
            <div className={styles.nickname}>
              <span>{nickname}</span>
              <button aria-label="change nickname">
                <EditIcon />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.container}>
        {"id" in query ? <Private /> : <Default />}
        <div ref={bottom}></div>
      </div>

      {"id" in query === false && isOpened && (
        <Tool
          props={{
            isSearching,
            setSearching,
            setOpened,
          }}
        />
      )}

      <InputBox props={{ msg, setMsg, setOpened, setSearching, isSearching }} />
    </div>
  );
}

export default Chat;
