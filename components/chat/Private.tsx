import useChatStore from "@/store/useChat";
import useSocketStore from "@/store/useSocket";
import styles from "./Common.module.css";

function Private() {
  const { socketId } = useSocketStore();
  const { privateRoom, privateChat } = useChatStore();

  return (
    <ul>
      {socketId && (
        <li className={styles.notice}>
          {privateRoom?.host.slice(0, 8)}님과의 일대일 대화가 시작되었습니다.
        </li>
      )}
      {privateChat.map((v, i) =>
        v.leave ? (
          <li key={`msg${i + 1}`} className={styles.notice}>
            {`${v.leave.slice(0, 8)}님이 퇴장하셨습니다.`}
          </li>
        ) : (
          <li
            key={`msg${i + 1}`}
            className={v.sender === socketId ? styles.me : ""}
          >
            <div
              className={
                v.sender === socketId
                  ? `${styles.bubble} ${styles.me}`
                  : styles.bubble
              }
            >
              {v.msg}
            </div>
          </li>
        )
      )}
    </ul>
  );
}

export default Private;
