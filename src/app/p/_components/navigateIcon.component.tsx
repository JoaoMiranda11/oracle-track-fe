import {
    Home,
    LineChart,
    Package,
    PanelLeft,
    Send,
    Search,
    Settings,
    MessageCircle,
    Users2,
  } from "lucide-react";

export const NavigateIcon = ({ routeName }: { routeName: string }) => {
  const classN = "h-5 w-5";

  switch (routeName) {
    case "send":
      return <Send className={classN} />;
    case "chat":
      return <MessageCircle className={classN} />;
    case "products":
      return <Package className={classN} />;
    case "customers":
      return <Users2 className={classN} />;
    case "analytics":
      return <LineChart className={classN} />;
    case "settings":
      return <Settings className={classN} />;
    default:
      return <Home className={classN} />;
  }
};
