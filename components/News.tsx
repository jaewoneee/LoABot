import { EventType, NoticeType } from "@/types/news";
import styles from "./News.module.css";

function News({ data }: { data: EventType[] | NoticeType[] | null }) {
  return (
    <li className={styles["news-box"]}>
      <p>
        로스트아크의 최신 {data && "Thumbnail" in data[0] ? "소식" : "공지"}
        입니다.
      </p>
      <ul>
        {data?.map((v, i) => (
          <li key={`news${i + 1}`}>
            <a href={v.Link} target="_blank">
              {v.Title}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default News;
