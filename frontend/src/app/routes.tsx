import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Upload } from "./pages/Upload";
import { Result } from "./pages/Result";
import { History } from "./pages/History";
import { Guidelines } from "./pages/Guidelines";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "upload", Component: Upload },
      { path: "result", Component: Result },
      { path: "history", Component: History },
      { path: "guidelines", Component: Guidelines },
    ],
  },
]);
