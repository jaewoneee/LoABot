/* eslint-disable @next/next/no-img-element */
import useSocketStore from "@/store/useSocket";
import { CharacterProfileType } from "@/types/character";
import styles from "./Character.module.css";
import chat from "./Chat.module.css";
import { useRouter } from "next/router";

function Character({
  id,
  data,
  shared,
}: {
  id: string;
  data: CharacterProfileType | null;
  shared?: boolean;
}) {
  const router = useRouter();
  const { socket, socketId } = useSocketStore();

  const shareCharacterInfo = () => {
    const message = {
      id: socketId,
      data,
      shared: true,
      chatRoom: `room-${socketId!.slice(0, 4)}`,
    };
    socket?.emit("character", message);
  };

  const joinPrivateChatRoom = async (id: string) => {
    const chatRoom = `room-${id.slice(0, 4)}`;
    socket?.emit(
      "chatroom",
      {
        host: id,
        guest: socketId,
        chatRoom,
      },
      () => router.push(`?id=${chatRoom}`)
    );
  };

  return (
    <li className={`${styles["character-box"]} ${socketId === id && chat.me}`}>
      {id !== socketId && <p className={chat.name}>{id?.slice(0, 8)}</p>}
      <div
        className={id === socketId ? `${chat.bubble} ${chat.me}` : chat.bubble}
      >
        {data?.CharacterImage && (
          <img src={data.CharacterImage} alt="character-image" />
        )}
        <div>
          <p>
            {data?.ServerName} {data?.CharacterClassName}
          </p>
          <p>{data?.CharacterName}</p>
        </div>
        {!shared && <button onClick={shareCharacterInfo}>공유하기</button>}
        {shared && socketId !== id && (
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
              onClick={() => joinPrivateChatRoom(id)}
            >
              훈수두기
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default Character;
