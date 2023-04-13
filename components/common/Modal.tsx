import useModalStore from "@/store/useModal";
import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import Nickname from "./Nickname";

function Modal() {
  const modal = useRef(null);
  const { type, closeModal } = useModalStore();

  const handleClose = (e: any) => {
    const { target } = e;
    modal.current === target && closeModal();
  };

  const setModalContent = (type: string) => {
    switch (type) {
      case "nickname":
        return <Nickname />;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, []);

  return (
    <div className={`bg ${styles["modal-wrapper"]}`} ref={modal}>
      {setModalContent(type as string)}
    </div>
  );
}
export default Modal;
