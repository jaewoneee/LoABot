import { ChangeEvent, useEffect, useRef, useState } from "react";
import useSocketStore from "@/store/useSocket";
import { PROFILE } from "@/config/constants";
import Tool from "./Tool";
import { PrivateRoomType } from "@/types";
import styles from "./Chat.module.css";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Image from "next/image";
import { useRouter } from "next/router";
import { scrollToBottom } from "@/utils/scrollEvent";
import useChatStore from "@/store/useChat";
import Default from "./chat/Default";
import Private from "./chat/Private";
export interface PrivateMessage extends PrivateRoomType {
  msg: string;
}

function Chat() {
  const router = useRouter();
  const { query } = router;
  const { socket, socketId, disconnect } = useSocketStore();
  const [msg, setMsg] = useState<string>("");
  const { chat, privateChat, privateRoom, setPrivateRoom, setChatList } =
    useChatStore();
  const [isSearching, setSearching] = useState(false);
  const [isOpened, setOpened] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!isSearching && !privateRoom && msg) {
      const message = {
        id: socketId,
        msg,
      };

      socket?.emit("send-message", message);
      setMsg("");
    } else if (privateRoom) {
      console.log("private=====>", privateRoom);
      const privateMsg = { ...privateRoom, msg };
      socket?.emit("private-message", privateMsg);
    } else {
      fetchCharacterInfo();
    }
  };

  const fetchCharacterInfo = async (type = PROFILE) => {
    const url = `/api/loa/character?name=${msg}&type=${type}`;
    const data = await fetch(url).then((res) => res.json());

    setSearching(false);
    setOpened(false);
    setChatList({ id: socketId as string, data });
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMsg(value);
  };

  const leaveChatRoom = () => {
    router.push("/");
  };

  useEffect(() => {
    // event listener
    socket?.on("message", (message) => {
      setChatList(message);
    });

    socket?.on("private", (data: PrivateRoomType) => {
      setPrivateRoom(data);
      console.log("listened");
      router.push(`?id=${data?.chatRoom}`);
    });

    socket?.on("receive-private-message", (data: PrivateMessage) => {
      console.log("received====>", data);
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
          <div>
            <Image
              src="/profile.jpg"
              width={50}
              height={50}
              alt="profile-image"
            />
            <p>{socketId.slice(0, 8)}</p>
          </div>
        </div>
      )}
      <div className={styles.container}>
        {"id" in query ? <Private /> : <Default />}
        <div ref={bottom}></div>
      </div>

      {isOpened && <Tool props={{ isSearching, setSearching, setOpened }} />}

      <div className={styles["input-box"]}>
        <button
          onClick={() => setOpened((state) => !state)}
          aria-label="open tool box"
        >
          <AddRoundedIcon />
        </button>
        <div>
          <input
            type="text"
            value={msg}
            placeholder={
              isSearching
                ? "캐릭터명을 입력해 주세요"
                : "메시지를 입력해 주세요"
            }
            onKeyPress={(e) => {
              if (e.key === "Enter" && msg.length > 0) {
                sendMessage();
                setMsg("");
              }
            }}
            onChange={(e) => handleChangeEvent(e)}
          />
          <button
            onClick={sendMessage}
            aria-label="send message"
            className={msg.length > 0 ? "" : styles.disabled}
          >
            <ArrowUpwardRoundedIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
