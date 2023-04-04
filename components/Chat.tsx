import { ChangeEvent, useEffect, useState } from "react";
import useSocketStore from "@/store/useSocket";
import { BASE_URL, EVENT, NOTICE, PROFILE } from "@/config/constants";
import Character from "./Character";
import { CharacterProfileType } from "@/types/character";

type MessageType = {
  id: string;
  msg?: string;
  data?: CharacterProfileType;
  shared?: boolean;
};

function Chat() {
  const { socket, socketId } = useSocketStore();
  const [msg, setMsg] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [character, setCharacter] = useState<string>("");
  const [characterInfo, setCharacaterInfo] = useState<any | null>(null);
  const [isSearching, setSearching] = useState(false);
  const [chat, setChat] = useState<MessageType[]>([]);

  const sendMessage = async () => {
    // 일반 메시지
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

  const fetchNewsList = async (type: string) => {
    const url = `/api/loa/news?type=${type}`;
    const data = await fetch(url).then((res) => res.json());
    console.log(data);
  };

  const fetchCharacterInfo = async (type = PROFILE) => {
    const url = `/api/loa/character?name=${character}&type=${type}`;
    const data = await fetch(url).then((res) => res.json());
    setCharacaterInfo(data);
    setSearching(false);
    console.log("character=====>", data);
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    isSearching ? setCharacter(value) : setMsg(value);
  };

  useEffect(() => {
    socket?.on("message", (message) => {
      setChat((state) => {
        return [...state, message];
      });
    });
  }, [socket]);

  useEffect(() => {
    setMsg("");
    if (isSearching) {
      setChat((state) => {
        return [...state, { id: socketId as string }];
      });
    }
  }, [isSearching]);

  useEffect(() => {
    console.log("list--=-====>", chat);
  }, [chat]);

  return (
    <div>
      {socketId && (
        <div>
          <p>{socketId} 채팅방 연결 완료</p>
        </div>
      )}

      <ul>
        <li>
          <div>선택지 1</div>
          <div>
            <button onClick={() => fetchNewsList(EVENT)}>새소식 보기</button>
            <button onClick={() => fetchNewsList(NOTICE)}>
              최근 공지 보기
            </button>
            <button onClick={() => setSearching(true)}>캐릭터 검색</button>
          </div>
        </li>
        {chat.map((v, i) =>
          v.msg ? (
            <li key={`msg${i + 1}`} className={v.id === socketId ? "me" : ""}>
              {v.msg}
            </li>
          ) : v.data || characterInfo ? (
            <Character
              key={`character${i + 1}`}
              data={v.data || characterInfo}
              shared={v.shared || false}
            />
          ) : null
        )}
      </ul>
      <div>
        <input
          type="text"
          value={isSearching ? character : msg}
          placeholder={
            isSearching ? "캐릭터명을 입력해 주세요" : "메시지를 입력해 주세요"
          }
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              setMsg("");
              setCharacter("");
            }
          }}
          onChange={(e) => handleChangeEvent(e)}
        />
        <button onClick={sendMessage}>SEND</button>
      </div>
    </div>
  );
}

export default Chat;
