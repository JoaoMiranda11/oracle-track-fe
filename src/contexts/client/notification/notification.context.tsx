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
import { WsEventsClient, WsEventsServer } from "./ws.enum";
import { useCredits } from "@/hooks/credits.hook";

export interface WsMessage<T> {
  msg?: string;
  metadata?: T;
}

interface NotificationContextValues {
  emit: (ev: WsEventsClient, message: any) => void;
  on: <T>(ev: WsEventsServer, cb: (data: WsMessage<T>) => void) => void;
  connected: boolean;
}

const NotificationContext = createContext({} as NotificationContextValues);

interface ListenningEvents {}

interface EmitEvents {}

type SocketMessages = Socket<ListenningEvents, EmitEvents>;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { getPlan } = usePlan();
  const { updateCredits } = useCredits();
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

      socket.on(WsEventsServer.UPDATE_CREDITS, (ev: any) => {
        if (typeof ev?.metadata === "number") updateCredits(ev.metadata);
        return;
      });
    },
    [user?._id]
  );

  const emit = (ev: WsEventsClient, message: string) => {
    socketRef?.current?.emit(ev, message);
  };

  function on<T>(ev: WsEventsServer, cb: (data: WsMessage<T>) => void) {
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
