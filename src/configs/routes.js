import { lazy } from "react";

export const routes = [
    {
        path: "/swap",
        exact: true,
        component: lazy(() => import("../pages/Swap"))
    },
    {
        path: "/liquidity",
        exact: true,
        component: lazy(() => import("../pages/Liquidity"))
    },
    {
        path: "/dashboard",
        exact: true,
        component: lazy(() => import("../pages/Dashboard"))
    }
]
export const redirects = [
    {
        path: "/",
        exact: true,
        to: "/dashboard"
    }
]