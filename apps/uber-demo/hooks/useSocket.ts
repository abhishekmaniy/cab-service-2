import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(`${process.env.WEBSOCKET_URL}`, {
      transports: ["websocket"], 
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); 
    };
  }, []);

  return socket;
};

export default useWebSocket;
