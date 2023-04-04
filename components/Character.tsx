/* eslint-disable @next/next/no-img-element */
import useSocketStore from "@/store/useSocket";
import { CharacterProfileType } from "@/types/character";

function Character({
  data,
  shared,
}: {
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
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <li>
      <img src={data?.CharacterImage} alt="character-image" />
      <div>
        <p>
          {data?.ServerName} {data?.CharacterClassName}
        </p>
        <p>{data?.CharacterName}</p>
      </div>
      {!shared && <button onClick={shareCharacterInfo}>공유하기</button>}
    </li>
  );
}

export default Character;
