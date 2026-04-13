import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { useI18n } from "../lib/i18n";

export function RootLayout() {
  const { language } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main key={language} className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
