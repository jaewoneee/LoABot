import { useEffect } from "react";
import Chat from "@/components/Chat";
import useSocketStore from "@/store/useSocket";
import Head from "next/head";
import useChatStore from "@/store/useChat";

const Index: React.FC = () => {
  const { socket, socketId, connect, disconnect } = useSocketStore();
  const { setNickname } = useChatStore();

  useEffect((): any => {
    console.log("socket connected");
    connect();

    return () => {
      console.log("socket disconnected");
      socket && disconnect();
    };
  }, []);

  useEffect((): any => {
    socketId && setNickname(socketId.slice(0, 6));
  }, [socketId]);

  return (
    <div>
      <Head>
        <title>LOA BOT</title>
        <meta name="description" content="A simple chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Chat />
    </div>
  );
};

export default Index;
