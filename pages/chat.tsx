import React, { useState, useEffect } from "react";
import Chat from "../components/Chat";
import useSocketStore from "../store/useSocket";

export type IMsg = {
  msg: string;
  stage?: number;
  select?: string;
};

// component
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
      <Chat />
    </div>
  );
};

export default Index;
