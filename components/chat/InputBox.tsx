import { PROFILE } from "@/config/constants";
import useChatStore from "@/store/useChat";
import useSocketStore from "@/store/useSocket";
import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import styles from "../Chat.module.css";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface InputBoxInterface {
  msg: string;
  setMsg: Dispatch<SetStateAction<string>>;
  setToolOpened: Dispatch<SetStateAction<boolean>>;
  setSearching: Dispatch<SetStateAction<boolean>>;
  isSearching: boolean;
}

function InputBox({ props }: { props: InputBoxInterface }) {
  const router = useRouter();
  const { query } = router;
  const { msg, setMsg, setToolOpened, setSearching, isSearching } = props;
  const { nickname, privateRoom, setChatList } = useChatStore();
  const { socket, socketId } = useSocketStore();

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMsg(value);
  };

  const sendMessage = () => {
    if (!isSearching && !privateRoom && msg) {
      const message = {
        id: socketId,
        nickname,
        msg,
      };
      socket?.emit("send-message", message);
    } else if (privateRoom) {
      const privateMsg = { ...privateRoom, msg, sender: socketId };
      socket?.emit("send-private-message", privateMsg);
    } else {
      fetchCharacterInfo();
    }
    setMsg("");
  };

  const fetchCharacterInfo = async (type = PROFILE) => {
    const url = `/api/loa/character?name=${msg}&type=${type}`;
    const data = await fetch(url).then((res) => {
      if (!res.ok) {
        console.log("error!");
      } else {
        return res.json();
      }
    });

    setSearching(false);
    setToolOpened(false);
    setChatList({ id: socketId as string, nickname, data });
  };
  return (
    <div className={styles["input-box"]}>
      {"id" in query === false && (
        <button
          onClick={() => setToolOpened((state: boolean) => !state)}
          aria-label="open tool box"
        >
          <AddRoundedIcon />
        </button>
      )}

      <div>
        <input
          type="text"
          value={msg}
          placeholder={
            isSearching ? "캐릭터명을 입력해 주세요" : "메시지를 입력해 주세요"
          }
          onKeyPress={(e) => {
            if (e.key === "Enter" && msg?.length > 0) {
              sendMessage();
              setMsg("");
            }
          }}
          onChange={(e) => handleChangeEvent(e)}
        />
        <button
          onClick={() => sendMessage()}
          aria-label="send message"
          className={msg?.length > 0 ? "" : styles.disabled}
        >
          <ArrowUpwardRoundedIcon />
        </button>
      </div>
    </div>
  );
}

export default InputBox;
