import { EVENT, NOTICE } from "@/config/constants";
import { MessageType } from "@/types";
import { Dispatch, SetStateAction } from "react";
import styles from "./Tool.module.css";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function Tool({
  props,
}: {
  props: {
    isSearching: boolean;
    setSearching: Dispatch<SetStateAction<boolean>>;
    setChat: Dispatch<SetStateAction<MessageType[]>>;
    setOpened: Dispatch<SetStateAction<boolean>>;
  };
}) {
  const { isSearching, setSearching, setChat, setOpened } = props;
  const fetchNewsList = async (type: string) => {
    const url = `/api/loa/news?type=${type}`;

    try {
      const news = await fetch(url).then((res) => res.json());
      setChat((state) => {
        return [...state, { news }];
      });
    } catch (error) {
      console.error(error);
    }
    setOpened(false);
  };

  const handleClick = () => {
    if (isSearching) {
      setSearching(false);
      setOpened(false);
    } else {
      setSearching(true);
    }
  };

  return (
    <div className={styles["tool-box"]}>
      <button onClick={() => fetchNewsList(EVENT)} aria-label="새소식 보기">
        <GradeRoundedIcon />
        <p>새소식</p>
      </button>
      <button onClick={() => fetchNewsList(NOTICE)} aria-label="공지 보기">
        <ArticleRoundedIcon />
        <p>공지</p>
      </button>
      <button
        onClick={handleClick}
        aria-label={isSearching ? "닫기" : "캐릭터 검색하기"}
      >
        {isSearching ? (
          <>
            <CloseRoundedIcon /> <p>닫기</p>
          </>
        ) : (
          <>
            <SearchRoundedIcon /> <p>캐릭터 검색</p>
          </>
        )}
      </button>
    </div>
  );
}

export default Tool;