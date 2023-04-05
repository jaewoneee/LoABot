/* eslint-disable @next/next/no-img-element */
import useSocketStore from "@/store/useSocket";
import { CharacterProfileType } from "@/types/character";
import styles from "./Character.module.css";
import chat from "./Chat.module.css";

function Character({
  id,
  data,
  shared,
}: {
  id: string;
  data: CharacterProfileType | null;
  shared?: boolean;
}) {
  const { socket, socketId } = useSocketStore();

  const shareCharacterInfo = async () => {
    const message = {
      id: socketId,
      data,
      shared: true,
    };
    await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <li className={`${styles["character-box"]} ${socketId === id && chat.me}`}>
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
        <a
          href={`https://iloa.gg/character/${data?.CharacterName}`}
          className={styles.link}
          target="_blank"
        >
          구경하기
        </a>
      )}
    </li>
  );
}

export default Character;
