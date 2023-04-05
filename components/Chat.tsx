import { ChangeEvent, useEffect, useRef, useState } from "react";
import useSocketStore from "@/store/useSocket";
import { PROFILE } from "@/config/constants";
import Character from "./Character";
import News from "./News";
import Tool from "./Tool";
import { MessageType } from "@/types";
import styles from "./Chat.module.css";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Image from "next/image";

function Chat() {
  const { socket, socketId } = useSocketStore();
  const [msg, setMsg] = useState<string>("");
  const [isSearching, setSearching] = useState(false);
  const [chat, setChat] = useState<MessageType[]>([]);
  const [isOpened, setOpened] = useState(false);
  const chatList = useRef<HTMLUListElement | null>(null);

  const sendMessage = async () => {
    if (!isSearching && msg) {
      const message = {
        id: socketId,
        msg,
      };
      // dispatch message to other users
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // reset field if OK
      if (resp.ok) setMsg("");
    } else {
      fetchCharacterInfo();
    }
  };

  const fetchCharacterInfo = async (type = PROFILE) => {
    const url = `/api/loa/character?name=${msg}&type=${type}`;
    const data = await fetch(url).then((res) => res.json());

    setSearching(false);
    setOpened(false);
    setChat((state) => {
      return [...state, { id: socketId as string, data }];
    });
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMsg(value);
  };

  useEffect(() => {
    // event listener
    socket?.on("message", (message) => {
      setChat((state) => {
        return [...state, message];
      });
    });
  }, [socket]);

  useEffect(() => {
    if (isSearching) {
      setChat((state) => {
        return [...state, { id: socketId as string }];
      });
    }
    setMsg("");
  }, [isSearching]);

  useEffect(() => {
    console.log("list--=-====>", chat);

    const { scrollHeight } = chatList?.current as HTMLUListElement;
    (chatList.current as HTMLUListElement).scrollTo(0, scrollHeight + 300);
  }, [chat]);

  return (
    <div className={styles["chat-container"]}>
      {socketId && (
        <div className={styles["info-box"]}>
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

      <ul ref={chatList}>
        <li>{socketId?.slice(0, 8)}님 안녕하세요!</li>
        {chat.map((v, i) =>
          v.msg ? (
            <li
              key={`msg${i + 1}`}
              className={v.id === socketId ? styles.me : ""}
            >
              {v.msg}
            </li>
          ) : v.data ? (
            <Character
              id={v.id as string}
              key={`character${i + 1}`}
              data={v.data}
              shared={v.shared || false}
            />
          ) : v.news ? (
            <News data={v.news} />
          ) : null
        )}
      </ul>
      {isOpened && (
        <Tool props={{ isSearching, setSearching, setChat, setOpened }} />
      )}

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
