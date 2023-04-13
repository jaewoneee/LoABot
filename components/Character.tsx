/* eslint-disable @next/next/no-img-element */
import useSocketStore from "@/store/useSocket";
import { CharacterProfileType } from "@/types/character";
import styles from "./Character.module.css";
import chat from "./chat/Common.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import useChatStore from "@/store/useChat";

function Character({
  host,
  data,
  shared,
}: {
  host: { id: string; nickname: string };
  data: CharacterProfileType | null;
  shared?: boolean;
}) {
  const router = useRouter();
  const { nickname } = useChatStore();
  const { socket, socketId } = useSocketStore();
  const [isShared, setShared] = useState(false);

  const shareCharacterInfo = () => {
    const message = {
      id: host.id,
      nickname: host.nickname,
      data,
      shared: true,
      chatRoom: `room-${socketId!.slice(0, 4)}`,
    };
    socket?.emit("character", message);
    setShared(true);
  };

  const joinPrivateChatRoom = async () => {
    const chatRoom = `room-${host.id.slice(0, 4)}`;
    socket?.emit(
      "enter-chatroom",
      {
        host,
        guest: { id: socketId, nickname },
        chatRoom,
        isConnected: true,
      },
      () => router.replace(`?id=${chatRoom}`)
    );
  };

  return (
    <>
      {shared && host.id === socketId ? null : (
        <li
          className={`${styles["character-box"]} ${
            socketId === host.id && chat.me
          }`}
        >
          {host.id !== socketId && <p className={chat.name}>{nickname}</p>}
          <div
            className={
              host.id === socketId ? `${chat.bubble} ${chat.me}` : chat.bubble
            }
          >
            {data?.CharacterImage && (
              <img
                src={data.CharacterImage}
                alt="character-image"
                style={{ aspectRatio: "1/1.25" }}
              />
            )}
            <div>
              <div className={styles.topper}>
                <p>
                  {data?.ServerName || "-"} | {data?.CharacterClassName}
                </p>
                <p>{data?.CharacterName}</p>
              </div>
              <div className={styles.bottom}>
                <p>
                  <span>아이템:</span> Lv.{data?.ItemMaxLevel}
                </p>
                <p>
                  <span>전투:</span> Lv.{data?.CharacterLevel}
                </p>
                <p>
                  <span>원정대:</span> Lv.{data?.ExpeditionLevel}
                </p>
              </div>
            </div>

            {host.id === socketId && (
              <button
                onClick={shareCharacterInfo}
                className={isShared ? styles.disabled : ""}
              >
                {isShared ? "공유완료" : "공유하기"}
              </button>
            )}
            {shared && socketId !== host.id && (
              <>
                <a
                  href={`https://iloa.gg/character/${data?.CharacterName}`}
                  className={styles.link}
                  target="_blank"
                >
                  구경하기
                </a>
                <button
                  className={styles.link}
                  onClick={() => joinPrivateChatRoom()}
                >
                  훈수두기
                </button>
              </>
            )}
          </div>
        </li>
      )}
    </>
  );
}

export default Character;
