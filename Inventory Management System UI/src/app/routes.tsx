import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import TransactionHistory from "./pages/TransactionHistory";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Users from "./pages/Users";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "products", Component: Products },
      { path: "categories", Component: Categories },
      { path: "users", Component: Users },
      { path: "stock-in", Component: StockIn },
      { path: "stock-out", Component: StockOut },
      { path: "transactions", Component: TransactionHistory },
      { path: "reports", Component: Reports },
      { path: "profile", Component: Profile },
    ],
  },
  {
    path: "*",
    Component: () => <Navigate to="/login" replace />,
  },
]);
