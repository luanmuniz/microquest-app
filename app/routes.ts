import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/today", "routes/today.tsx"),
    route("/history", "routes/history.tsx"),
] satisfies RouteConfig;
