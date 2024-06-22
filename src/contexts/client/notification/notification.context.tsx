import { useAuth } from "@/hooks/auth.hook";
import { usePlan } from "@/hooks/plan.hook";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { WsEventsServer } from "./ws.enum";

interface NotificationContextValues {
  emit: (ev: string, message: any) => void;
  on: (ev: string, cb: <T>(data: T) => void) => void;
  connected: boolean;
}

const NotificationContext = createContext({} as NotificationContextValues);

interface ListenningEvents {}

interface EmitEvents {}

type SocketMessages = Socket<ListenningEvents, EmitEvents>;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { getPlan } = usePlan();
  const socketRef = useRef<Socket<any, any>>();
  const [connected, setConnected] = useState(false);

  const socketActions = useCallback(
    function (user: UserJWT | null) {
      if (!user?._id) return;
      if (socketRef?.current?.active) return;

      socketRef.current = io(process.env.NEXT_PUBLIC_ORACLE_API_URL!, {
        query: {
          userId: user._id,
        },
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to server");
        setConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        setConnected(false);
      });

      socket.on(WsEventsServer.PAYMENT_PLAN, () => {
        getPlan();
        return;
      });
    },
    [user?._id]
  );

  const emit = (ev: string, message: string) => {
    socketRef?.current?.emit(ev, message);
  };

  function on<T>(ev: string, cb: (data: T) => void) {
    socketRef?.current?.on(ev, cb);
  }

  useEffect(() => {
    socketActions(user);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ emit, on, connected }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  return context;
};
