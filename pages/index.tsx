import { useEffect } from "react";
import Chat from "@/components/Chat";
import useSocketStore from "@/store/useSocket";
import Head from "next/head";

const Index: React.FC = () => {
  const { socket, connect, disconnect } = useSocketStore();

  useEffect((): any => {
    console.log("connect");
    connect();

    return () => {
      console.log("disconnect");
      socket && disconnect();
    };
  }, []);

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
