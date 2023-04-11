import { ChangeEvent, useEffect, useRef, useState } from "react";
import useSocketStore from "@/store/useSocket";
import { PROFILE } from "@/config/constants";
import Character from "./Character";
import News from "./News";
import Tool from "./Tool";
import { MessageType, PrivateRoomType } from "@/types";
import styles from "./Chat.module.css";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Image from "next/image";
import { useRouter } from "next/router";
import { scrollToBottom } from "@/utils/scrollEvent";
export interface PrivateMessage extends PrivateRoomType {
  msg: string;
}

function Chat() {
  const router = useRouter();
  const { query } = router;
  const { socket, socketId, disconnect } = useSocketStore();
  const [msg, setMsg] = useState<string>("");
  const [chat, setChat] = useState<MessageType[]>([]);
  const [privateChat, setPrivateChat] = useState<PrivateMessage[]>([]);
  const [isSearching, setSearching] = useState(false);
  const [isOpened, setOpened] = useState(false);
  const [privateRoom, setPrivateRoom] = useState<PrivateRoomType | null>(null);
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
    setChat((state) => {
      return [...state, { id: socketId as string, data }];
    });
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
      setChat((state) => {
        return [...state, message];
      });
    });

    socket?.on("private", (data: PrivateRoomType) => {
      setPrivateRoom(data);
      console.log("listened");
      router.push(`?id=${data?.chatRoom}`);
    });

    socket?.on("receive-private-message", (data: PrivateMessage) => {
      console.log("received====>", data);
      setPrivateChat((state) => {
        return [...state, data];
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
        {JSON.stringify(query) === "{}" && (
          <ul>
            {socketId && (
              <li className={styles.notice}>
                {socketId?.slice(0, 8)}님 안녕하세요!
              </li>
            )}
            {chat.map((v, i) =>
              v?.msg ? (
                <li
                  key={`msg${i + 1}`}
                  className={v.id === socketId ? styles.me : ""}
                >
                  {v.id !== socketId && chat[i - 1]?.id !== v?.id && (
                    <p className={styles.name}>{v.id?.slice(0, 8)}</p>
                  )}
                  <div
                    className={
                      v.id === socketId
                        ? `${styles.bubble} ${styles.me}`
                        : styles.bubble
                    }
                  >
                    {v.msg}
                  </div>
                </li>
              ) : v.data ? (
                <Character
                  id={v.id as string}
                  key={`character${i + 1}`}
                  data={v.data}
                  shared={v.shared || false}
                />
              ) : v.data === null ? (
                <li className={styles.me}>존재하지 않는 유저 정보입니다.</li>
              ) : v.news ? (
                <News data={v.news} />
              ) : null
            )}
          </ul>
        )}
        {"id" in query && (
          <ul>
            {socketId && (
              <li className={styles.notice}>
                {privateRoom?.host.slice(0, 8)}님과의 일대일 대화가
                시작되었습니다.
              </li>
            )}
            {privateChat.map((v, i) => (
              <li
                key={`msg${i + 1}`}
                className={v.host === socketId ? styles.me : ""}
              >
                <div
                  className={
                    v.host === socketId
                      ? `${styles.bubble} ${styles.me}`
                      : styles.bubble
                  }
                >
                  {v.msg}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div ref={bottom}></div>
      </div>

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
