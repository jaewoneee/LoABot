import useChatStore from "@/store/useChat";
import useModalStore from "@/store/useModal";
import { ChangeEvent, useState } from "react";
import styles from "./Modal.module.css";

function Nickname() {
  const { closeModal } = useModalStore();
  const { setNickname, nickname } = useChatStore();
  const [preNickname, setPreNickname] = useState<string>(nickname);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPreNickname(value);
  };

  const changeNickname = () => {
    if (preNickname && preNickname.length > 0 && preNickname.length < 7) {
      localStorage.setItem("nickname", preNickname);
      setNickname(preNickname);
      closeModal();
    } else {
      alert("닉네임은 한 글자 이상 8글자 이하여야 합니다.");
    }
  };

  return (
    <div className={styles.nickname}>
      <input
        type="text"
        placeholder={preNickname ? preNickname : "닉네임을 입력해 주세요"}
        value={preNickname}
        onChange={(e) => handleChange(e)}
      />
      <button onClick={changeNickname}>변경하기</button>
    </div>
  );
}

export default Nickname;
