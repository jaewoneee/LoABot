import { useEffect, useState } from "react";
import { IMsg } from "../pages/chat";
import useSocketStore from "../store/useSocket";

function Chat() {
  const { socket } = useSocketStore();
  const [id, setId] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState<string[]>([]);
  const [msg, setMsg] = useState<string>("");

  const sendMessage = async () => {
    if (msg) {
      // build message obj
      const message: IMsg = {
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
    }
  };

  useEffect(() => {
    // log socket connection
    socket?.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      setId(socket?.id);
      setConnected(true);
    });

    // update chat on new message dispatched
    socket?.on("message", (message) => {
      setChat((state) => {
        return [...state, message];
      });
    });
  }, [socket]);

  return (
    <div>
      {connected && (
        <div>
          <p>{id} 채팅방 연결 완료</p>
        </div>
      )}

      <ul>
        {chat.map((v, i) => (
          <li key={`msg${i + 1}`}>{v}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={msg}
          placeholder="메시지를 입력해 주세요"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) => {
            const { value } = e.target;
            setMsg(value);
          }}
        />
        <button onClick={sendMessage}>SEND</button>
      </div>
    </div>
  );
}

export default Chat;
