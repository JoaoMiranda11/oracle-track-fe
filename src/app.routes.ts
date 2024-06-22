export const LoginRoute = "/login";
export const AuthMainRoute = "/p/dashboard";

interface Route {
  title: string;
  href: string;
  routes?: Route[];
}

export const dashboardRoutes: Route[] = [
  // {
  //   title: "chat",
  //   href: "/p/chat",
  // },
  {
    title: "send",
    href: "/p/send",
  },
  {
    title: "products",
    href: "/p/products",
  },
  // {
  //   title: "customers",
  //   href: "/p/customers",
  // },
  // {
  //   title: "analytics",
  //   href: "/p/analytics",
  // },
] as const;

export const routes: Route[] = [
  {
    title: "dashboard",
    href: "/p",
    routes: dashboardRoutes,
  },
  {
    title: "Landing Page",
    href: "/",
  },
  {
    title: "Login",
    href: "/auth/login",
  },
] as const;

export const dashBoardRoute = routes[0];
export const loginRoute = routes[2];