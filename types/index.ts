import { CharacterProfileType } from "./character";
import { EventType, NoticeType } from "./news";

export type MessageType = {
  id?: string;
  msg?: string;
  nickname?: string;
  data?: CharacterProfileType;
  shared?: boolean;
  news?: EventType[] | NoticeType[];
};

export type PrivateRoomType = {
  host: { id: string; nickname: string };
  guest: { id: string; nickname: string };
  chatRoom: string;
  isConnected: boolean;
};

export interface PrivateMessage extends PrivateRoomType {
  msg?: string;
  sender?: string;
  leave?: { id: string; nickname: string };
}
