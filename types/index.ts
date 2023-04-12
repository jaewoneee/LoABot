import { CharacterProfileType } from "./character";
import { EventType, NoticeType } from "./news";

export type MessageType = {
  id?: string;
  msg?: string;
  data?: CharacterProfileType;
  shared?: boolean;
  news?: EventType[] | NoticeType[];
};

export type PrivateRoomType = {
  host: string;
  guest: string;
  chatRoom: string;
  isConnected: boolean;
};

export interface PrivateMessage extends PrivateRoomType {
  msg?: string;
  sender?: string;
  leave?: string;
}
