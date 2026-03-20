import { createBrowserRouter, Navigate } from "react-router";
import { MobileLayout } from "./pages/MobileLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MyFundsPage } from "./pages/MyFundsPage";
import { HistoryPage } from "./pages/HistoryPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: MobileLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "my-funds",
        Component: MyFundsPage,
      },
      {
        path: "history",
        Component: HistoryPage,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
