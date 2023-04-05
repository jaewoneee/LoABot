import { CharacterProfileType } from "./character";
import { EventType, NoticeType } from "./news";

export type MessageType = {
  id?: string;
  msg?: string;
  data?: CharacterProfileType;
  shared?: boolean;
  news?: EventType[] | NoticeType[];
};
