import Character from "../Character";
import News from "../News";
import styles from "./Common.module.css";
import useSocketStore from "@/store/useSocket";
import useChatStore from "@/store/useChat";

function Default() {
  const { socketId } = useSocketStore();
  const { chat, nickname } = useChatStore();

  return (
    <ul>
      {socketId && <li className={styles.notice}>{nickname}님 안녕하세요!</li>}
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
          <li className={styles.me}>
            <div className={`${styles.bubble} ${styles.me}`}>
              존재하지 않는 유저 정보입니다.
            </div>
          </li>
        ) : v.news ? (
          <News data={v.news} />
        ) : null
      )}
    </ul>
  );
}

export default Default;
